import { generateResumePdf } from "@/lib/generateResumePdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const pdf = await generateResumePdf();
  const preview = new URL(request.url).searchParams.get("preview") === "1";

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${preview ? "inline" : "attachment"}; filename="Danielius-Zajenckauskas-Resume.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
