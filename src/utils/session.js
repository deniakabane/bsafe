import { cookies } from "next/headers";

export function setSessionCookie(response, adminId) {
  const sessionId = crypto.randomUUID(); // Generate UUID unik
  console.log("🆔 Generated Session ID:", sessionId);

  response.cookies.set("admin_session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 minggu
  });

  // Simpan session di database (jika perlu)
  return sessionId;
}
