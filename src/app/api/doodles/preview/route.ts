import { NextResponse } from "next/server";
import { generateDoodlePortraitPdf } from "@/lib/generateDoodlePortraitPdf";

export const runtime = "nodejs";

const PNG_PREFIX = "data:image/png;base64,";
const MAX_PORTRAIT_CARD_BYTES = 8_000_000;

function isPng(buffer: Buffer) {
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

export function GET(request: Request) {
  const previewPage = new URL("/", request.url);
  previewPage.searchParams.set("doodlePdfPreview", "1");
  return NextResponse.redirect(previewPage);
}

export async function POST(request: Request) {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: "This preview origin is not allowed." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "This preview origin is not allowed." }, { status: 403 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid preview request." }, { status: 400 });
  }

  const portraitCard = typeof body.portraitCard === "string" ? body.portraitCard : "";
  if (!portraitCard.startsWith(PNG_PREFIX)) {
    return NextResponse.json({ error: "The portrait preview is missing." }, { status: 400 });
  }

  const portraitCardBuffer = Buffer.from(portraitCard.slice(PNG_PREFIX.length), "base64");
  if (!isPng(portraitCardBuffer) || portraitCardBuffer.length > MAX_PORTRAIT_CARD_BYTES) {
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
