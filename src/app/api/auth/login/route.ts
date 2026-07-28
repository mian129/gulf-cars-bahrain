import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, generateToken } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    let admin = await prisma.admin.findUnique({ where: { email } });

    // Auto-create default admin if none exists
    if (!admin) {
      const defaultEmail = "admin@gulfcarsbahrain.com";
      const defaultPassword = "admin123";
      
      if (email === defaultEmail && password === defaultPassword) {
        const hashedPassword = await hashPassword(defaultPassword);
        admin = await prisma.admin.create({
          data: {
            email: defaultEmail,
            password: hashedPassword,
            name: "Admin",
          },
        });
      } else {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    } else {
      const isValid = await verifyPassword(password, admin.password);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    }

    const token = generateToken(admin.id);

    return NextResponse.json({
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
