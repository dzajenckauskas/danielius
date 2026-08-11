import { beforeEach, describe, expect, it, vi } from "vitest";
import { DOODLE_TURNSTILE_FIELD } from "@/lib/doodle-form";
import { doodleRateLimiter } from "@/lib/doodle-rate-limit";

const mocks = vi.hoisted(() => ({
  deliverDoodle: vi.fn(),
  verifyTurnstileToken: vi.fn(),
}));

vi.mock("@/lib/doodle-delivery", () => ({
  deliverDoodle: mocks.deliverDoodle,
  DoodleDeliveryConfigurationError: class DoodleDeliveryConfigurationError extends Error {},
}));

vi.mock("@/lib/turnstile", () => ({
  verifyTurnstileToken: mocks.verifyTurnstileToken,
}));

import { POST } from "./route";

const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const jpeg = Buffer.from([0xff, 0xd8, 0xff]);

function validBody() {
  return {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "I enjoyed drawing on the portrait.",
    issuedAtMs: Date.now() - 4_000,
    artwork: `data:image/png;base64,${png.toString("base64")}`,
    composite: `data:image/jpeg;base64,${jpeg.toString("base64")}`,
    portraitCard: `data:image/jpeg;base64,${jpeg.toString("base64")}`,
    [DOODLE_TURNSTILE_FIELD]: "verified-token",
  };
}

function createRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return new Request("https://portfolio.test/api/doodles", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "portfolio.test",
      origin: "https://portfolio.test",
      "x-forwarded-for": "192.0.2.1",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  doodleRateLimiter.reset();
  mocks.deliverDoodle.mockReset().mockResolvedValue(undefined);
  mocks.verifyTurnstileToken.mockReset().mockResolvedValue({ success: true });
});

describe("POST /api/doodles", () => {
  it("rejects a cross-origin request before parsing or delivery", async () => {
    const response = await POST(createRequest(validBody(), { origin: "https://attacker.test" }));
    expect(response.status).toBe(403);
    expect(mocks.verifyTurnstileToken).not.toHaveBeenCalled();
    expect(mocks.deliverDoodle).not.toHaveBeenCalled();
  });

  it("rejects an artwork payload whose declared type and signature disagree", async () => {
    const response = await POST(createRequest({
      ...validBody(),
      artwork: `data:image/png;base64,${Buffer.from("forged").toString("base64")}`,
    }));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: expect.stringMatching(/drawing is invalid/i) });
    expect(mocks.deliverDoodle).not.toHaveBeenCalled();
  });

  it("records successful deliveries and rejects the sixth request in the window", async () => {
    for (let index = 0; index < 5; index += 1) {
      const response = await POST(createRequest(validBody()));
      expect(response.status).toBe(200);
    }

    const response = await POST(createRequest(validBody()));
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("600");
    expect(mocks.deliverDoodle).toHaveBeenCalledTimes(5);
  });

  it("does not consume a rate-limit slot when delivery fails", async () => {
    mocks.deliverDoodle.mockRejectedValueOnce(new Error("SMTP unavailable"));
    const failed = await POST(createRequest(validBody()));
    expect(failed.status).toBe(502);

    mocks.deliverDoodle.mockResolvedValue(undefined);
    for (let index = 0; index < 5; index += 1) {
      const response = await POST(createRequest(validBody()));
      expect(response.status).toBe(200);
    }
  });
});
