import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    return await handleSession(admin.id);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleSession(userId) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day expiry
  const sessionId = uuidv4();

  await prisma.session.deleteMany({ where: { admin_id: userId } });

  await prisma.session.create({
    data: {
      session_id: sessionId,
      role: "admin",
      expires_at: expiresAt,
      admin_id: userId,
    },
  });

  // **Gunakan admin_session agar sesuai dengan checkSession dan logout**
  const response = NextResponse.json({ message: "Login successful" });

  response.cookies.set("admin_session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
