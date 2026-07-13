import { generateResumePdf } from "@/lib/generateResumePdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const pdf = await generateResumePdf();

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Danielius-Zajenckauskas-Resume.pdf"',
      "Cache-Control": "no-store",
    },
  });
}

