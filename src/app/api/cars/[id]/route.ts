import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

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

    // Find or create brand
    let brand = await prisma.brand.findFirst({ where: { name: body.brand } });
    if (!brand) {
      brand = await prisma.brand.create({
        data: { name: body.brand, slug: slugify(body.brand) },
      });
    }

    const car = await prisma.car.update({
      where: { id },
      data: {
        title: body.title,
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
        images: body.images,
        category: body.category,
        featured: body.featured,
        status: body.status,
        brandId: brand.id,
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
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 });
  }
}
