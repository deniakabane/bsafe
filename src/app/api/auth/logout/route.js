import { prisma } from "@/libs/prisma";
import { cookies } from "next/headers";

export async function POST() {
  const sessionId = cookies().get("admin_session")?.value;
  if (!sessionId)
    return Response.json({ message: "No session found" }, { status: 401 });

  // Hapus session di database
  await prisma.session.delete({ where: { id: sessionId } });

  // Hapus session dari cookies
  cookies().delete("admin_session");

  return Response.json({ message: "Logout successful" });
}
