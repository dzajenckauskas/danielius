import { describe, expect, it } from "vitest";
import { isJpeg, isPng, parseDoodleAttachments } from "./doodle-attachments";

const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const jpeg = Buffer.from([0xff, 0xd8, 0xff]);

const validBody = {
  artwork: `data:image/png;base64,${png.toString("base64")}`,
  composite: `data:image/jpeg;base64,${jpeg.toString("base64")}`,
  portraitCard: `data:image/jpeg;base64,${jpeg.toString("base64")}`,
};

describe("image signatures", () => {
  it("recognises PNG and JPEG magic bytes", () => {
    expect(isPng(png)).toBe(true);
    expect(isJpeg(jpeg)).toBe(true);
  });

  it("does not trust an extension or data URL without matching bytes", () => {
    expect(isPng(Buffer.from("not a png"))).toBe(false);
    expect(isJpeg(Buffer.from("not a jpeg"))).toBe(false);
  });
});

describe("parseDoodleAttachments", () => {
  it("returns validated image buffers", () => {
    const result = parseDoodleAttachments(validBody);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.artwork).toEqual(png);
      expect(result.value.composite).toEqual(jpeg);
      expect(result.value.portraitCard).toEqual(jpeg);
    }
  });

  it("rejects a forged PNG data URL", () => {
    const result = parseDoodleAttachments({
      ...validBody,
      artwork: `data:image/png;base64,${Buffer.from("forged").toString("base64")}`,
    });
    expect(result).toEqual({ ok: false, error: "The drawing is invalid or too large to send." });
  });
});
