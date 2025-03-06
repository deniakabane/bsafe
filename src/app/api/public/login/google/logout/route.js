import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logout successful" });

  // Hapus cookies dari server
  response.cookies.set("auth_token", "", { maxAge: 0 });
  response.cookies.set("user_name", "", { maxAge: 0 });
  response.cookies.set("user_picture", "", { maxAge: 0 });
  response.cookies.set("user_id", "", { maxAge: 0 });

  return response;
}
