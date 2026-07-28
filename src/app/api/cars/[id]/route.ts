import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import sharp from "sharp";

async function compressImages(images: string[]): Promise<string[]> {
  const compressed: string[] = [];
  for (const img of images) {
    if (typeof img !== "string" || !img.startsWith("data:image")) {
      compressed.push(img);
      continue;
    }
    try {
      const match = img.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!match) { compressed.push(img); continue; }
      const inputBuf = Buffer.from(match[2], "base64");
      if (inputBuf.length < 5000) { compressed.push(img); continue; }
      const outputBuf = await sharp(inputBuf)
        .resize({ width: 800, height: 600, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 65, mozjpeg: true })
        .toBuffer();
      compressed.push(`data:image/jpeg;base64,${outputBuf.toString("base64")}`);
    } catch {
      compressed.push(img);
    }
  }
  return compressed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const car = await prisma.car.findUnique({
      where: { id },
      include: { brand: true, model: true },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("Get car error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    let brand = await prisma.brand.findFirst({ where: { name: body.brand } });
    if (!brand) {
      brand = await prisma.brand.create({
        data: { name: body.brand, slug: slugify(body.brand) },
      });
    }

    let modelId = undefined;
    if (body.model) {
      let model = await prisma.model.findFirst({ where: { name: body.model, brandId: brand.id } });
      if (!model) {
        model = await prisma.model.create({
          data: { name: body.model, slug: slugify(body.model), brandId: brand.id },
        });
      }
      modelId = model.id;
    }

    let categoryId = undefined;
    if (body.categoryName) {
      const cat = await prisma.category.findFirst({ where: { name: body.categoryName } });
      if (cat) categoryId = cat.id;
    }

    let imagesData = body.images;
    if (imagesData) {
      const imagesArr = typeof imagesData === "string" ? JSON.parse(imagesData) : imagesData;
      const compressed = await compressImages(imagesArr);
      imagesData = JSON.stringify(compressed);
    }

    const car = await prisma.car.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        price: parseFloat(body.price),
        year: parseInt(body.year),
        mileage: parseInt(body.mileage),
        fuelType: body.fuelType,
        transmission: body.transmission,
        bodyType: body.bodyType,
        color: body.color,
        engineSize: body.engineSize || null,
        seats: body.seats ? parseInt(body.seats) : null,
        doors: body.doors ? parseInt(body.doors) : null,
        images: imagesData,
        category: body.category,
        featured: body.featured,
        status: body.status,
        brandId: brand.id,
        modelId,
        categoryId,
      },
    });

    return NextResponse.json(car);
  } catch (error) {
    console.error("Update car error:", error);
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.car.delete({ where: { id } });
    return NextResponse.json({ message: "Car deleted" });
  } catch (error) {
    console.error("Delete car error:", error);
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
  }
}
