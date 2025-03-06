import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function checkSession() {
  try {
    const cookieStore = await cookies(); // ✅ Perbaikan dengan await
    const sessionId = cookieStore.get("admin_session")?.value;

    console.log("Session ID:", sessionId); // Debugging

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { session_id: sessionId },
    });

    if (!session || new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, message: "Session expired or not found" },
        { status: 401 }
      );
    }

    return { success: true, session };
  } catch (error) {
    console.error("Error in checkSession:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
