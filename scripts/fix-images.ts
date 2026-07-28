import { prisma } from "../src/lib/db";
import sharp from "sharp";

async function fixOversizedImages() {
  const cars = await prisma.car.findMany({
    where: { status: "active" },
    select: { id: true, title: true, images: true },
  });

  let fixed = 0;
  for (const car of cars) {
    try {
      const imagesArr = JSON.parse(car.images);
      let changed = false;
      const compressed: string[] = [];

      for (const img of imagesArr) {
        if (typeof img !== "string" || !img.startsWith("data:image")) {
          compressed.push(img);
          continue;
        }
        const match = img.match(/^data:image\/(\w+);base64,(.+)$/);
        if (!match) { compressed.push(img); continue; }
        const inputBuf = Buffer.from(match[2], "base64");
        if (inputBuf.length < 5000) { compressed.push(img); continue; }

        const outputBuf = await sharp(inputBuf)
          .resize({ width: 800, height: 600, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 65, mozjpeg: true })
          .toBuffer();

        const newBase64 = `data:image/jpeg;base64,${outputBuf.toString("base64")}`;
        compressed.push(newBase64);
        changed = true;
        console.log(`  Compressed ${car.title}: ${(inputBuf.length / 1024).toFixed(0)}KB -> ${(outputBuf.length / 1024).toFixed(0)}KB`);
      }

      if (changed) {
        await prisma.car.update({
          where: { id: car.id },
          data: { images: JSON.stringify(compressed) },
        });
        fixed++;
      }
    } catch (e) {
      console.log(`  Skipping ${car.title}: parse error`);
    }
  }

  console.log(`\nFixed ${fixed} cars with oversized images`);
  process.exit(0);
}

fixOversizedImages().catch((e) => { console.error(e); process.exit(1); });
