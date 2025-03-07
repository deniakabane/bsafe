import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import moment from "moment"; // Gunakan moment.js untuk memeriksa tanggal

const prisma = new PrismaClient();

export async function GET(req, context) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return response(400, false, "ID is required");
    }

    const idAsNumber = parseInt(id, 10);
    const isNumber = !isNaN(idAsNumber);
    const today = new Date(); // Gunakan objek Date, bukan string

    const whereCondition = {
      ...(isNumber ? { id: idAsNumber } : { certificate_no: id }),
      publish: true,
      training: {
        end_date: {
          lte: today,
        },
      },
    };

    const userTraining = await prisma.userTraining.findFirst({
      where: whereCondition,
      select: {
        id: true,
        user_id: true,
        training_id: true,
        certificate_no: true,
        theme: true,
        status: true,
        publish: true,
        updated_at: true,
        training: {
          select: {
            name: true,
            slug: true,
            end_date: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!userTraining) {
      return response(404, false, "User training data not found");
    }

    return response(
      200,
      true,
      "Data user training berhasil diambil",
      userTraining
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve user training data", {
      error: error.message,
    });
  }
}
