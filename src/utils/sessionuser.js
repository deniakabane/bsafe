import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
const prisma = new PrismaClient();

export async function checkSessionUser() {
  try {
    const allCookies = cookies().getAll(); // Ambil semua cookies

    console.log("🍪 Semua Cookies:", allCookies);
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJha2FiYW5lZGVuaTM0QGdtYWlsLmNvbSIsIm5hbWUiOiJOYW1hIEJhcnV1IiwiaWF0IjoxNzQxMjk3MjAzLCJleHAiOjE3NDEzMDQ0MDN9.Rog2CPg7ZLoDpR87H35B8EKPwLkWC2irf37fWknx5aM";

    if (!token) {
      return { success: false, message: "Token tidak ditemukan" };
    }

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify(token, secretKey);

    console.log("✅ JWT Verified:", payload);

    // 🔍 Cari user di database berdasarkan email dari token
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
