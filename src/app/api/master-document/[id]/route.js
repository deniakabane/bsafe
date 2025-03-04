import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";

const prisma = new PrismaClient();

export async function PUT(req, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    const jsonData = await req.json();
    const { name, url, status, training_id, skp_id } = jsonData;

    if (!id) {
      return response(400, false, "ID wajib diisi");
    }

    const existingDocument = await prisma.masterDocument.findUnique({
      where: { id },
    });
    if (!existingDocument) {
      return response(404, false, "Master Document tidak ditemukan");
    }

    if (training_id && skp_id) {
      return response(
        400,
        false,
        "Training ID dan SKP ID tidak boleh diisi bersamaan"
      );
    }

    let type = "USER";
    if (training_id) type = "TRAINING";
    if (skp_id) type = "SKP";

    const updatedDocument = await prisma.masterDocument.update({
      where: { id },
      data: {
        name,
        url,
        status,
        type,
        training: training_id ? { connect: { id: training_id } } : undefined,
        skp: skp_id ? { connect: { id: skp_id } } : undefined,
      },
    });
    return response(
      200,
      true,
      "Master Document berhasil diperbarui",
      updatedDocument
    );
  } catch (error) {
    return response(500, false, "Failed to update Master Document", null, {
      error: error.message,
    });
  }
}

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (!id) {
      return response(400, false, "ID wajib diisi");
    }

    await prisma.masterDocument.delete({ where: { id } });
    return response(200, true, "Master Document berhasil dihapus");
  } catch (error) {
    return response(500, false, "Failed to delete Master Document", null, {
      error: error.message,
    });
  }
}

export async function GET(req, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (!id) {
      return response(400, false, "ID wajib diisi");
    }
    const document = await prisma.masterDocument.findUnique({
      where: { id },
      include: {
        training: true,
        skp: true,
        user: true,
      },
    });

    if (!document) {
      return response(404, false, "Master Document tidak ditemukan");
    }

    return response(200, true, "Master Document berhasil diambil", document);
  } catch (error) {
    return response(
      500,
      false,
      "Failed to retrieve Master Document detail",
      null,
      {
        error: error.message,
      }
    );
  }
}
