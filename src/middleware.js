import { NextResponse } from "next/server";

export function middleware(request) {
  const authToken = request.cookies.get("auth_token")?.value;
  console.log(authToken);
  console.log("tes");

  const protectedRoutes = ["/profile"]; // Daftar halaman yang butuh autentikasi

  if (protectedRoutes.includes(request.nextUrl.pathname) && !authToken) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect ke homepage jika tidak ada token
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile"], // Bisa tambahkan lebih banyak halaman jika perlu
};
