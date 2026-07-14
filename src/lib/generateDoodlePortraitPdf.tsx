import { renderToBuffer } from "@react-pdf/renderer";
import { DoodlePortraitDocument } from "@/components/doodle/DoodlePortraitDocument";

export async function generateDoodlePortraitPdf(portraitCard: Buffer) {
  return renderToBuffer(<DoodlePortraitDocument portraitCard={portraitCard} />);
}
