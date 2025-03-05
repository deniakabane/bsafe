import { NextResponse } from "next/server";

export function middleware(req) {
  console.log("🔍 Middleware Activated");
  console.log("Request Path:", req.nextUrl.pathname);

  // Izinkan akses ke API publik tanpa autentikasi
  if (req.nextUrl.pathname.startsWith("/api/public")) {
    console.log("✅ Public API Access Allowed");
    return NextResponse.next();
  }

  // Ambil session dari cookies
  const adminSession = req.cookies.get("admin_session")?.value;
  console.log("Session Cookie:", adminSession);

  // Jika tidak ada session, kembalikan 401 Unauthorized
  if (!adminSession) {
    console.log("❌ Unauthorized - No Session Found");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  console.log("✅ Authorized - Session Found");
  return NextResponse.next();
}

// Middleware ini hanya berjalan pada semua route API kecuali `/api/public`
export const config = {
  matcher: "/api/:path*",
};
