import { isNormalizedStrokeArray } from "@/lib/doodle-strokes";

const PNG_PREFIX = "data:image/png;base64,";
const JPEG_PREFIX = "data:image/jpeg;base64,";
const MAX_ARTWORK_BYTES = 3_000_000;
const MAX_COMPOSITE_BYTES = 4_000_000;
const MAX_PORTRAIT_CARD_BYTES = 3_000_000;
const MAX_STROKES_BYTES = 1_000_000;

export type DoodleAttachments = {
  artwork: Buffer;
  composite: Buffer;
  portraitCard: Buffer;
  strokes: Buffer | null;
};

type AttachmentResult =
  | { ok: true; value: DoodleAttachments }
  | { ok: false; error: string };

export function isPng(buffer: Buffer) {
  return buffer.length >= 8
    && buffer[0] === 0x89
    && buffer[1] === 0x50
    && buffer[2] === 0x4e
    && buffer[3] === 0x47
    && buffer[4] === 0x0d
    && buffer[5] === 0x0a
    && buffer[6] === 0x1a
    && buffer[7] === 0x0a;
}

export function isJpeg(buffer: Buffer) {
  return buffer.length >= 3
    && buffer[0] === 0xff
    && buffer[1] === 0xd8
    && buffer[2] === 0xff;
}

function decodeImage(
  value: unknown,
  prefix: string,
  signature: (buffer: Buffer) => boolean,
  maxBytes: number,
  missingError: string,
  invalidError: string,
) {
  if (typeof value !== "string" || !value.startsWith(prefix)) {
    return { ok: false as const, error: missingError };
  }

  const buffer = Buffer.from(value.slice(prefix.length), "base64");
  if (!signature(buffer) || buffer.length > maxBytes) {
    return { ok: false as const, error: invalidError };
  }

  return { ok: true as const, value: buffer };
}

export function parseDoodleAttachments(body: Record<string, unknown>): AttachmentResult {
  const artwork = decodeImage(
    body.artwork,
    PNG_PREFIX,
    isPng,
    MAX_ARTWORK_BYTES,
    "The drawing is missing or invalid.",
    "The drawing is invalid or too large to send.",
  );
  if (!artwork.ok) return artwork;

  const composite = decodeImage(
    body.composite,
    JPEG_PREFIX,
    isJpeg,
    MAX_COMPOSITE_BYTES,
    "The portrait preview is missing or invalid.",
    "The portrait preview is invalid or too large to send.",
  );
  if (!composite.ok) return composite;

  const portraitCard = decodeImage(
    body.portraitCard,
    JPEG_PREFIX,
    isJpeg,
    MAX_PORTRAIT_CARD_BYTES,
    "The portrait card is missing or invalid.",
    "The portrait card is invalid or too large to send.",
  );
  if (!portraitCard.ok) return portraitCard;

  let strokes: Buffer | null = null;
  if (body.strokes != null && isNormalizedStrokeArray(body.strokes)) {
    const serialized = JSON.stringify(body.strokes, null, 2);
    if (Buffer.byteLength(serialized) <= MAX_STROKES_BYTES) strokes = Buffer.from(serialized);
  }

  return {
    ok: true,
    value: {
      artwork: artwork.value,
      composite: composite.value,
      portraitCard: portraitCard.value,
      strokes,
    },
  };
}
