import { renderToBuffer } from "@react-pdf/renderer";
import { ResumeDocument } from "@/components/resume/ResumeDocument";

export async function generateResumePdf() {
  return renderToBuffer(<ResumeDocument />);
}

