import { generateResumePdf } from "@/lib/generateResumePdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const pdf = await generateResumePdf();
  const body = new Uint8Array(pdf);
  const filename = "Danielius-Zajenckauskas-CV.pdf";

  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"; filename*=UTF-8''${filename}`,
      "Content-Length": String(body.byteLength),
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}
