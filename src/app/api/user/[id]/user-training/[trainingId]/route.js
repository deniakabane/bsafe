import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";

const prisma = new PrismaClient();

export async function PUT(req, context) {
  try {
    const params = await context.params;
    const userId = parseInt(params.id, 10);
    const trainingId = parseInt(params.trainingId, 10);

    if (isNaN(userId) || isNaN(trainingId)) {
      return response(400, false, "Invalid user ID or training ID");
    }

    const jsonData = await req.json();
    const { proof_of_tf, reseller_id } = jsonData;

    // Validasi reseller
    let validResellerId = null;
    if (reseller_id) {
      const reseller = await prisma.reseller.findUnique({
        where: { id: reseller_id },
      });

      if (!reseller) {
        return response(400, false, "Invalid reseller ID");
      }

      validResellerId = reseller_id;
    }

    // Cek apakah user training ada
    const existingUserTraining = await prisma.userTraining.findFirst({
      where: {
        user_id: userId,
        training_id: trainingId,
      },
      include: {
        training: true,
      },
    });

    if (!existingUserTraining) {
      return response(404, false, "User training record not found");
    }

    let appealId = null;
    let nominal = existingUserTraining.training?.price || 0;

    // Cek apakah training masuk ke dalam bundling
    const bundling = await prisma.productAppealTraining.findFirst({
      where: { training_id: trainingId },
    });

    if (bundling && bundling.appeal_id) {
      // Cek apakah user punya lebih dari satu training dalam bundling ini
      const userBundledTrainings = await prisma.userTraining.findMany({
        where: {
          user_id: userId,
          training_id: {
            in: (
              await prisma.productAppealTraining.findMany({
                where: { appeal_id: bundling.appeal_id },
                select: { training_id: true },
              })
            ).map((t) => t.training_id),
          },
        },
      });

      if (userBundledTrainings.length > 1) {
        appealId = bundling.appeal_id;

        // ✅ Ambil harga dari ProductAppeal, bukan jumlah dari training
        const appeal = await prisma.productAppeal.findUnique({
          where: { id: appealId },
          select: { price: true },
        });

        nominal = appeal?.price || 0; // ✅ FIX: Sekarang ambil dari ProductAppeal
      }
    }

    // Cek apakah user sudah melakukan transfer untuk training_id atau appeal_id ini
    const existingPayment = await prisma.historyPayment.findFirst({
      where: {
        user_id: userId,
        OR: [
          { training_id: appealId ? null : trainingId },
          { appeal_id: appealId || undefined },
        ],
      },
    });

    if (existingPayment) {
      return response(400, false, "Anda sudah melakukan transfer sebelumnya.");
    }

    // Simpan ke HistoryPayment
    const payment = await prisma.historyPayment.create({
      data: {
        user_id: userId,
        training_id: appealId ? null : trainingId,
        appeal_id: appealId,
        nominal,
        proof_of_tf,
        reseller_id: validResellerId,
        status: "PAID",
      },
    });

    if (appealId) {
      await prisma.userTraining.updateMany({
        where: {
          user_id: userId,
          training_id: {
            in: (
              await prisma.productAppealTraining.findMany({
                where: { appeal_id: appealId },
                select: { training_id: true },
              })
            ).map((t) => t.training_id),
          },
        },
        data: { status: "PESERTA" },
      });
    } else {
      await prisma.userTraining.update({
        where: { id: existingUserTraining.id },
        data: { status: "PESERTA" },
      });
    }

    return response(
      200,
      true,
      "Payment recorded and user training status updated",
      payment
    );
  } catch (error) {
    console.error("Error:", error.message);
    return response(500, false, "Failed to process payment", null, {
      error: error.message,
    });
  }
}

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const userId = parseInt(params.id, 10);
    const trainingId = parseInt(params.trainingId, 10);

    if (isNaN(userId) || isNaN(trainingId)) {
      return response(400, false, "Invalid user ID or training ID");
    }

    const existingUserTraining = await prisma.userTraining.findFirst({
      where: {
        user_id: userId,
        training_id: trainingId,
      },
    });

    if (!existingUserTraining) {
      return response(404, false, "User training record not found");
    }

    await prisma.userTraining.delete({
      where: { id: existingUserTraining.id },
    });

    return response(200, true, "User training successfully deleted");
  } catch (error) {
    return response(500, false, "Failed to delete user training", null, {
      error: error.message,
    });
  }
}
