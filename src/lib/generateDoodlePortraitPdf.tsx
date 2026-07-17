import { renderToBuffer } from "@react-pdf/renderer";
import { DoodlePortraitDocument } from "@/components/doodle/DoodlePortraitDocument";

// Read a JPEG's pixel dimensions straight from its SOF marker, so the PDF page
// can match the keepsake card's aspect ratio instead of a fixed one (a resized
// portrait produces a differently-shaped card, which a fixed page would stretch).
function jpegDimensions(buffer: Buffer): { width: number; height: number } | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    // Start-of-frame markers carry the dimensions; skip the non-frame ones.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    const segmentLength = buffer.readUInt16BE(offset + 2);
    if (segmentLength < 2) return null;
    offset += 2 + segmentLength;
  }
  return null;
}

export async function generateDoodlePortraitPdf(portraitCard: Buffer) {
  const dimensions = jpegDimensions(portraitCard);
  const aspect = dimensions && dimensions.height
    ? dimensions.width / dimensions.height
    : 900 / 1070;
  return renderToBuffer(<DoodlePortraitDocument portraitCard={portraitCard} aspect={aspect} />);
}
