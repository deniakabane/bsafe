import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
const prisma = new PrismaClient();
import { checkSession } from "@/utils/session";

export async function PUT(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (!sessionResponse.success) {
      return sessionResponse;
    }
    const id = parseInt(context.params.id, 10);
    const jsonData = await req.json();
    let { name, url, status, training_id, skp_id } = jsonData;

    if (!id) {
      return response(400, false, "ID wajib diisi");
    }

    const existingDocument = await prisma.masterDocument.findUnique({
      where: { id },
    });
    if (!existingDocument) {
      return response(404, false, "Master Document tidak ditemukan");
    }

    // Jika skp_id ada, training_id harus null, dan sebaliknya
    if (skp_id) {
      training_id = null;
    } else if (training_id) {
      skp_id = null;
    }

    // Pastikan status dikonversi ke Boolean jika bukan undefined
    if (typeof status === "string") {
      status = status.toLowerCase() === "true";
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
        training: training_id
          ? { connect: { id: training_id } }
          : { disconnect: true },
        skp: skp_id ? { connect: { id: skp_id } } : { disconnect: true },
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
    const sessionResponse = await checkSession(req);

    if (!sessionResponse.success) {
      return sessionResponse;
    }
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return response(400, false, "Invalid History Payment ID");

    const historyPaymentExists = await prisma.historyPayment.findUnique({
      where: { id },
    });
    if (!historyPaymentExists) {
      return response(404, false, "History Payment not found");
    }

    await prisma.historyPayment.delete({
      where: { id },
    });

    return response(200, true, "History Payment berhasil dihapus");
  } catch (error) {
    return response(500, false, "Failed to delete History Payment", null, {
      error: error.message,
    });
  }
}

export async function GET(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (!sessionResponse.success) {
      return sessionResponse;
    }
    const params = await context.params;
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return response(400, false, "Invalid History Payment ID");
    }

    const historyPayment = await prisma.historyPayment.findUnique({
      where: { id },
      include: {
        training: {
          select: {
            id: true,
            name: true,
          },
        },
        reseller: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!historyPayment) {
      return response(404, false, "History Payment not found");
    }

    return response(
      200,
      true,
      "History Payment berhasil diambil",
      historyPayment
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve History Payment data", {
      error: error.message,
    });
  }
}
