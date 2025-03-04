import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import response from "@/utils/response";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Ganti dengan key yang aman

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return response(400, false, "Email dan password wajib diisi");
    }

    // Cari admin berdasarkan email
    const adminUser = await prisma.adminUser.findUnique({ where: { email } });
    if (!adminUser) {
      return response(401, false, "Email atau password salah");
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return response(401, false, "Email atau password salah");
    }

    // Buat token JWT
    const token = jwt.sign(
      {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        level: adminUser.level,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return response(200, true, "Login berhasil", { token });
  } catch (error) {
    return response(500, false, "Login gagal", null, { error: error.message });
  }
}
