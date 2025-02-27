import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
const prisma = new PrismaClient();

export async function PUT(req, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return response(400, false, "Invalid History Payment ID");

    const jsonData = await req.json();
    const {
      user_id,
      training_id,
      skp_id,
      nominal,
      proof_of_tf,
      reseller_id,
      status,
    } = jsonData;

    const historyPaymentExists = await prisma.historyPayment.findUnique({
      where: { id },
    });
    if (!historyPaymentExists) {
      return response(404, false, "History Payment not found");
    }

    // Validasi user
    if (user_id) {
      const userExists = await prisma.user.findUnique({
        where: { id: user_id },
      });
      if (!userExists) {
        return response(400, false, "User not found");
      }
    }

    // Validasi training
    if (training_id) {
      const trainingExists = await prisma.training.findUnique({
        where: { id: training_id },
      });
      if (!trainingExists) {
        return response(400, false, "Training not found");
      }
    }

    // Validasi SKP
    if (skp_id) {
      const skpExists = await prisma.skp.findUnique({
        where: { id: skp_id },
      });
      if (!skpExists) {
        return response(400, false, "SKP not found");
      }
    }

    // Validasi reseller
    if (reseller_id) {
      const resellerExists = await prisma.reseller.findUnique({
        where: { id: reseller_id },
      });
      if (!resellerExists) {
        return response(400, false, "Reseller not found");
      }
    }

    const updatedHistoryPayment = await prisma.historyPayment.update({
      where: { id },
      data: {
        user: user_id ? { connect: { id: user_id } } : undefined,
        training: training_id
          ? { connect: { id: training_id } }
          : training_id === null
          ? { disconnect: true }
          : undefined,
        skp: skp_id
          ? { connect: { id: skp_id } }
          : skp_id === null
          ? { disconnect: true }
          : undefined,
        reseller: reseller_id
          ? { connect: { id: reseller_id } }
          : reseller_id === null
          ? { disconnect: true }
          : undefined,
        nominal,
        proof_of_tf,
        status,
      },
    });

    return response(
      200,
      true,
      "History Payment berhasil diperbarui",
      updatedHistoryPayment
    );
  } catch (error) {
    return response(500, false, "Failed to update History Payment", null, {
      error: error.message,
    });
  }
}

export async function DELETE(req, context) {
  try {
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
