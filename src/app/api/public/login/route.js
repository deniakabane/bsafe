import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // Jangan lupa untuk import bcrypt
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server"; // Import NextResponse
import { cookies } from "next/headers"; // Import cookies untuk menyimpan session di cookie

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required for admin login" },
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

    // Generate session
    const sessionResponse = await handleSession(admin.id);

    // Set session_id in cookies
    const cookieStore = cookies();
    cookieStore.set("session_id", sessionResponse.session_id, {
      httpOnly: true, // Only accessible by the server
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiry
      path: "/", // Make it available throughout the application
    });

    // Return session_id as response
    return NextResponse.json({ session_id: sessionResponse.session_id });
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
  const sessionId = uuidv4(); // Generate session ID using uuidv4

  await prisma.session.deleteMany({
    where: { admin_id: userId },
  });

  const session = await prisma.session.create({
    data: {
      session_id: sessionId,
      role: "admin",
      expires_at: expiresAt,
      admin_id: userId,
    },
  });

  return { session_id: session.session_id };
}
