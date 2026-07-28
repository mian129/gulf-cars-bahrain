import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const compressed: string[] = [];

    for (const img of images) {
      if (typeof img !== "string") continue;

      if (img.startsWith("http")) {
        compressed.push(img);
        continue;
      }

      if (!img.startsWith("data:image")) continue;

      const match = img.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!match) continue;

      const format = match[1] === "png" ? "png" : "jpeg";
      const inputBuf = Buffer.from(match[2], "base64");

      const outputBuf = await sharp(inputBuf)
        .resize({ width: 1024, height: 768, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 70, mozjpeg: true })
        .toBuffer();

      compressed.push(`data:image/jpeg;base64,${outputBuf.toString("base64")}`);
    }

    return NextResponse.json({ images: compressed });
  } catch (error) {
    console.error("Upload compression error:", error);
    return NextResponse.json({ error: "Compression failed" }, { status: 500 });
  }
}
