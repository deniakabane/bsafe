import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("admin_session")?.value; // Ganti sesuai nama cookie

    if (!sessionId) {
      return NextResponse.json(
        { message: "No session found. You are not logged in." },
        { status: 400 }
      );
    }

    // Hapus session dari database
    await prisma.session.delete({
      where: { session_id: sessionId },
    });

    // **Buat response & hapus cookie dengan nama yang benar**
    const response = NextResponse.json({ message: "Successfully logged out" });

    response.cookies.set("admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0), // Cara yang benar untuk menghapus cookie
    });

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
