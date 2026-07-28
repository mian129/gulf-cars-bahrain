import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "gulf-cars-bahrain-secret-key-2024";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(adminId: string): string {
  return jwt.sign({ id: adminId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { id: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch {
    return null;
  }
}

export async function getAdminFromToken(token: string) {
  const payload = verifyToken(token);
  if (!payload) return null;

  const admin = await prisma.admin.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, name: true },
  });

  return admin;
}
