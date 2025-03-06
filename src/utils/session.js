import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Import cookies from next/headers

const prisma = new PrismaClient();

export async function checkSession(req) {
  // Ambil session_id dari cookies
  const cookieStore = cookies();
  const sessionId = cookieStore.get("session_id"); // Ambil session_id dari cookies

  // Pastikan session_id ada
  if (!sessionId) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    // Cek apakah session_id ada di database
    const session = await prisma.session.findUnique({
      where: { session_id: sessionId.value }, // sessionId is an object, use .value to get the string
    });

    // Jika session tidak ditemukan atau sudah expired
    if (!session || new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { message: "Session expired or not found" },
        { status: 401 }
      );
    }

    // Session valid, kembalikan session jika valid
    return NextResponse.json(
      { message: "Session is valid", session },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
