import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { read: body.read },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Update inquiry error:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.inquiry.delete({ where: { id } });
    return NextResponse.json({ message: "Inquiry deleted" });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
