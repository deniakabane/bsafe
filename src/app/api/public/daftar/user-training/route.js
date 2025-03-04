import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Request Body:", body);

    const { name, email, phone, type, bundling_id, training_id } = body;

    if (!name || !email || !phone || !type) {
      return response(400, false, "Nama, email, phone, dan type wajib diisi");
    }

    let trainingIds = [];

    if (type === "bundling") {
      if (!bundling_id) {
        return response(
          400,
          false,
          "Bundling ID wajib diisi untuk type bundling"
        );
      }

      // Ambil semua training_id dari bundling
      const bundlingTrainings = await prisma.productAppealTraining.findMany({
        where: { appeal_id: bundling_id },
        select: { training_id: true },
      });

      trainingIds = bundlingTrainings.map((t) => t.training_id);

      if (trainingIds.length === 0) {
        return response(
          400,
          false,
          "Tidak ada training terkait dengan bundling ini"
        );
      }
    } else if (type === "training") {
      if (!training_id || typeof training_id !== "number") {
        return response(
          400,
          false,
          "Training ID harus berupa angka untuk type training"
        );
      }
      trainingIds = [training_id];
    } else {
      return response(400, false, "Type harus 'bundling' atau 'training'");
    }

    const validTrainings = await prisma.training.findMany({
      where: { id: { in: trainingIds } },
      select: { id: true },
    });

    const validTrainingIds = validTrainings.map((t) => t.id);

    if (validTrainingIds.length !== trainingIds.length) {
      return response(400, false, "Satu atau lebih Training ID tidak valid");
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existingUser) {
      return response(400, false, "Email atau phone sudah terdaftar");
    }

    const user = await prisma.user.create({
      data: { name, email, phone },
    });

    await prisma.userTraining.createMany({
      data: validTrainingIds.map((trainingId) => ({
        user_id: user.id,
        training_id: trainingId,
        status: "DRAFT",
      })),
    });

    return response(201, true, "Pendaftaran berhasil");
  } catch (error) {
    return response(500, false, "Terjadi kesalahan", { error: error.message });
  }
}
