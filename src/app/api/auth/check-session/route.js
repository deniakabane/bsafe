import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function middleware(req) {
  const url = req.nextUrl.pathname;
  console.log("🔍 Middleware URL:", url);

  if (url.startsWith("/api/public")) {
    console.log("✅ Public API accessed:", url);
    return NextResponse.next();
  }

  const sessionId = req.cookies.get("admin_session")?.value;
  if (!sessionId) {
    console.log("⛔ No session ID found");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  console.log("🔍 Session ID from Cookie:", sessionId);

  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session || new Date(session.expires_at) < new Date()) {
    console.log("⛔ Invalid or expired session");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  console.log("✅ Authorized access:", url);
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
