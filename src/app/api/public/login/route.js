import { prisma } from "@/libs/prisma";
import { cookies } from "next/headers";

export async function POST(req) {
  const { email } = await req.json();

  // Cari user di database
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return Response.json({ message: "Invalid credentials" }, { status: 401 });

  // Buat session baru
  const sessionId = crypto.randomUUID();
  await prisma.session.create({
    data: {
      id: sessionId,
      user_id: user.id,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expire dalam 24 jam
    },
  });

  // Simpan session di cookies
  cookies().set("admin_session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 24 * 60 * 60, // 1 hari
  });

  return Response.json({ message: "Login successful!" });
}
