import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { setSessionCookie } from "@/utils/session";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log("🔍 Incoming Login Request:", { email });

    const adminUser = await prisma.adminUser.findUnique({ where: { email } });
    if (!adminUser) {
      console.log("❌ User Not Found");
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("🔑 Stored Password Hash:", adminUser.password);
    const isValidPassword = await bcrypt.compare(password, adminUser.password);
    if (!isValidPassword) {
      console.log("❌ Incorrect Password");
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ message: "Login successful" });
    const sessionId = setSessionCookie(response, adminUser.id); // Simpan session unik

    console.log("✅ Login Successful! Session ID:", sessionId);
    return response;
  } catch (error) {
    console.error("🔥 Login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
