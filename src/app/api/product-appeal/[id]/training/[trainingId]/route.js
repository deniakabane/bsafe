import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import { checkSession } from "@/utils/session";
const prisma = new PrismaClient();

export async function PUT(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const params = context.params;
    const appealId = parseInt(params.id, 10);
    const trainingId = parseInt(params.trainingId, 10);

    if (isNaN(appealId) || isNaN(trainingId)) {
      return response(400, false, "ID Appeal dan Training harus berupa angka");
    }

    const jsonData = await req.json();
    const { status } = jsonData;

    if (status === undefined) {
      return response(400, false, "Status wajib diisi");
    }

    const existingRecord = await prisma.productAppealTraining.findFirst({
      where: { appeal_id: appealId, training_id: trainingId },
    });

    if (!existingRecord) {
      return response(
        404,
        false,
        "Relasi Product Appeal dan Training tidak ditemukan"
      );
    }

    const updatedData = await prisma.productAppealTraining.updateMany({
      where: { appeal_id: appealId, training_id: trainingId },
      data: { status },
    });

    return response(
      200,
      true,
      "Relasi Product Appeal Training berhasil diperbarui",
      updatedData
    );
  } catch (error) {
    return response(
      500,
      false,
      "Gagal memperbarui Product Appeal Training",
      null,
      {
        error: error.message,
      }
    );
  }
}

export async function DELETE(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const params = context.params;
    const appealId = parseInt(params.id, 10);
    const trainingId = parseInt(params.trainingId, 10);

    if (isNaN(appealId) || isNaN(trainingId)) {
      return response(400, false, "ID Appeal dan Training harus berupa angka");
    }

    const existingRecord = await prisma.productAppealTraining.findFirst({
      where: { appeal_id: appealId, training_id: trainingId },
    });

    if (!existingRecord) {
      return response(
        404,
        false,
        "Relasi Product Appeal dan Training tidak ditemukan"
      );
    }

    await prisma.productAppealTraining.deleteMany({
      where: { appeal_id: appealId, training_id: trainingId },
    });

    return response(
      200,
      true,
      "Relasi Product Appeal Training berhasil dihapus"
    );
  } catch (error) {
    return response(
      500,
      false,
      "Gagal menghapus Product Appeal Training",
      null,
      {
        error: error.message,
      }
    );
  }
}

export async function GET(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const params = context.params;
    const appealId = parseInt(params.id, 10);
    const trainingId = parseInt(params.trainingId, 10);

    if (isNaN(appealId) || isNaN(trainingId)) {
      return response(400, false, "ID Appeal dan Training harus berupa angka");
    }

    const productAppealTraining = await prisma.productAppealTraining.findFirst({
      where: { appeal_id: appealId, training_id: trainingId },
      include: {
        training: true,
        appeal: true,
      },
    });

    if (!productAppealTraining) {
      return response(404, false, "Data tidak ditemukan");
    }

    return response(
      200,
      true,
      "Detail Product Appeal Training berhasil diambil",
      productAppealTraining
    );
  } catch (error) {
    return response(
      500,
      false,
      "Gagal mengambil detail Product Appeal Training",
      null,
      {
        error: error.message,
      }
    );
  }
}
