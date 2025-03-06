import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server"; // Import NextResponse
import { cookies } from "next/headers"; // Mengambil cookies di Next.js

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Mengambil session_id dari cookies
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session_id"); // Mengambil cookie berdasarkan nama

    // Pastikan session_id ada
    if (!sessionCookie) {
      return NextResponse.json(
        { message: "No session found. You are not logged in." },
        { status: 400 }
      );
    }

    const sessionId = sessionCookie.value; // Akses properti `value` untuk mendapatkan session ID

    console.log("Session ID from cookies:", sessionId); // Log session ID for debugging

    // Cari session di database berdasarkan session_id
    const session = await prisma.session.findUnique({
      where: { session_id: sessionId }, // Gunakan session_id langsung
    });

    console.log("Session found in DB:", session); // Log the session for debugging

    if (!session) {
      return NextResponse.json(
        { message: "Invalid session ID" },
        { status: 404 }
      );
    }

    // Hapus session dari database
    await prisma.session.delete({
      where: { session_id: sessionId },
    });

    // Hapus session cookie
    cookieStore.delete("session_id"); // Menghapus cookie session_id

    return NextResponse.json(
      { message: "Successfully logged out" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during logout:", error); // Log the actual error for debugging
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
