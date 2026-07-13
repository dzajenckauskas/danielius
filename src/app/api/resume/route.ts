import { generateResumePdf } from "@/lib/generateResumePdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const pdf = await generateResumePdf();
  const body = new Uint8Array(pdf);
  const preview = new URL(request.url).searchParams.get("preview") === "1";
  const filename = "Danielius-Zajenckauskas-CV.pdf";

  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${preview ? "inline" : "attachment"}; filename="${filename}"; filename*=UTF-8''${filename}`,
      "Content-Length": String(body.byteLength),
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}
