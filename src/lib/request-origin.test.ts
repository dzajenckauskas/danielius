import { describe, expect, it } from "vitest";
import { getSafeRequestOrigin, verifySameOrigin } from "./request-origin";

function request(headers: Record<string, string>) {
  return new Request("https://portfolio.test/api/doodles", { headers });
}

describe("verifySameOrigin", () => {
  it("accepts a matching host and origin", () => {
    expect(verifySameOrigin(request({ host: "portfolio.test", origin: "https://portfolio.test" }))).toBe(true);
  });

  it("rejects a different origin", () => {
    expect(verifySameOrigin(request({ host: "portfolio.test", origin: "https://attacker.test" }))).toBe(false);
  });

  it("rejects a different port", () => {
    expect(verifySameOrigin(request({ host: "portfolio.test:3000", origin: "https://portfolio.test:4000" }))).toBe(false);
  });

  it("rejects a malformed origin", () => {
    expect(verifySameOrigin(request({ host: "portfolio.test", origin: "not a URL" }))).toBe(false);
  });

  it("preserves support for clients without browser origin metadata", () => {
    expect(verifySameOrigin(request({ host: "portfolio.test" }))).toBe(true);
    expect(verifySameOrigin(request({ origin: "https://portfolio.test" }))).toBe(true);
  });
});

describe("getSafeRequestOrigin", () => {
  it("returns a normalized valid origin and safely ignores malformed metadata", () => {
    expect(getSafeRequestOrigin(request({ origin: "https://portfolio.test/path" }))).toBe("https://portfolio.test");
    expect(getSafeRequestOrigin(request({ origin: "not a URL" }))).toBe("");
  });
});
