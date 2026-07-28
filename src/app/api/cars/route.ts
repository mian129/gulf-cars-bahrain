import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { getAdminFromToken } from "@/lib/auth";

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
    
    // Find or create brand
    let brand = await prisma.brand.findFirst({ where: { name: body.brand } });
    if (!brand) {
      brand = await prisma.brand.create({
        data: { name: body.brand, slug: slugify(body.brand) },
      });
    }

    const carSlug = slugify(body.title + "-" + Date.now());

    const car = await prisma.car.create({
      data: {
        title: body.title,
        slug: carSlug,
        description: body.description,
        price: body.price,
        year: body.year,
        mileage: body.mileage,
        fuelType: body.fuelType,
        transmission: body.transmission,
        bodyType: body.bodyType,
        color: body.color,
        engineSize: body.engineSize || null,
        seats: body.seats || null,
        doors: body.doors || null,
        images: body.images || JSON.stringify(["/placeholder-car.jpg"]),
        category: body.category || "used",
        featured: body.featured || false,
        status: body.status || "active",
        brandId: brand.id,
      },
    });

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error("Create car error:", error);
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 });
  }
}
