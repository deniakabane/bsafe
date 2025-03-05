import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function setSessionInDB(response, adminId) {
  try {
    const sessionId = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);

    console.log("📝 Creating session in DB for user:", adminId);

    // Hapus session lama jika sudah ada
    await prisma.session.deleteMany({ where: { admin_id: adminId } });

    // Simpan session ke database
    const session = await prisma.session.create({
      data: {
        session_id: sessionId,
        admin_id: adminId, // GANTI admin_user_id -> admin_id (sesuai schema)
        expires_at: expiresAt,
      },
    });

    console.log("✅ Session created successfully:", session);

    // Set cookie
    response.cookies.set("admin_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 2 * 60 * 60,
    });

    return sessionId;
  } catch (error) {
    console.error("🔥 Error in setSessionInDB:", error);
    throw error;
  }
}
