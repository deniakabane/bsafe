import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function checkSessionUser() {
  try {
    // return { success: true };

    const token = cookies().get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Token tidak ditemukan" };
    }

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify(token, secretKey);

    console.log("✅ JWT Verified:", payload);

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    console.log("🔍 User dari Database:", user);

    if (!user) {
      return { success: false, message: "User tidak ditemukan" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("❌ Error saat cek session:", error);
    return { success: false, message: "Session tidak valid atau expired" };
  }
}
