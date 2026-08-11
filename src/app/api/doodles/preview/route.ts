import { NextResponse } from "next/server";
import { generateDoodlePortraitPdf } from "@/lib/generateDoodlePortraitPdf";
import { verifySameOrigin } from "@/lib/request-origin";
import { isJpeg } from "@/lib/doodle-attachments";

export const runtime = "nodejs";

const JPEG_PREFIX = "data:image/jpeg;base64,";
const MAX_PORTRAIT_CARD_BYTES = 3_000_000;

export function GET(request: Request) {
  const previewPage = new URL("/", request.url);
  previewPage.searchParams.set("doodlePdfPreview", "1");
  return NextResponse.redirect(previewPage);
}

export async function POST(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: "This preview origin is not allowed." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid preview request." }, { status: 400 });
  }

  const portraitCard = typeof body.portraitCard === "string" ? body.portraitCard : "";
  if (!portraitCard.startsWith(JPEG_PREFIX)) {
    return NextResponse.json({ error: "The portrait preview is missing." }, { status: 400 });
  }

  const portraitCardBuffer = Buffer.from(portraitCard.slice(JPEG_PREFIX.length), "base64");
  if (!isJpeg(portraitCardBuffer) || portraitCardBuffer.length > MAX_PORTRAIT_CARD_BYTES) {
    return NextResponse.json({ error: "The portrait preview is invalid or too large." }, { status: 400 });
  }

  try {
    const pdf = await generateDoodlePortraitPdf(portraitCardBuffer);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="doodle-portrait-preview.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Doodle PDF preview failed", error);
    return NextResponse.json({ error: "The PDF preview could not be generated." }, { status: 500 });
  }
}
