import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { getAdminFromToken } from "@/lib/auth";
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const status = searchParams.get("status") || "active";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const where: Record<string, unknown> = {};
    if (status !== "all") where.status = status;
    if (category) where.category = category;
    if (brand) where.brand = { slug: brand };

    const skip = (page - 1) * limit;

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        include: { brand: true, model: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.car.count({ where }),
    ]);

    return NextResponse.json({ cars, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Get cars error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let brand = await prisma.brand.findFirst({ where: { name: body.brand } });
    if (!brand) {
      brand = await prisma.brand.create({
        data: { name: body.brand, slug: slugify(body.brand) },
      });
    }

    let modelId = null;
    if (body.model) {
      let model = await prisma.model.findFirst({ where: { name: body.model, brandId: brand.id } });
      if (!model) {
        model = await prisma.model.create({
          data: { name: body.model, slug: slugify(body.model), brandId: brand.id },
        });
      }
      modelId = model.id;
    }

    let categoryId = null;
    if (body.categoryName) {
      const cat = await prisma.category.findFirst({ where: { name: body.categoryName } });
      if (cat) categoryId = cat.id;
    }

    const carSlug = slugify(body.title + "-" + Date.now());

    const rawImages = body.images || ["/placeholder-car.jpg"];
    const imagesArr = typeof rawImages === "string" ? JSON.parse(rawImages) : rawImages;
    const compressed = await compressImages(imagesArr);

    const car = await prisma.car.create({
      data: {
        title: body.title,
        slug: carSlug,
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
        images: JSON.stringify(compressed),
        category: body.category || "used",
        featured: body.featured || false,
        status: body.status || "active",
        brandId: brand.id,
        modelId,
        categoryId,
      },
    });

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error("Create car error:", error);
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 });
  }
}
