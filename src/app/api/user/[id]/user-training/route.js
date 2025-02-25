import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";
const prisma = new PrismaClient();

export async function GET(req, context) {
  try {
    const {
      page,
      limit,
      offset,
      search,
      sortField = "created_at",
      sortOrder = "desc",
    } = getQueryParams(req.url);

    const params = await context.params; // Tunggu params jika async
    const { id } = params; // Ambil ID setelah await

    if (!id) {
      return response(400, false, "User ID is required");
    }

    const searchCondition = buildSearchCondition("training_id", search);

    // Tambahkan filter berdasarkan ID user jika tersedia
    const whereCondition = {
      ...searchCondition,
      user_id: parseInt(id, 10), // Pastikan user_id berupa integer
    };

    const [userTrainings, totalItems] = await Promise.all([
      prisma.userTraining.findMany({
        where: whereCondition,
        select: {
          id: true,
          user_id: true,
          training_id: true,
          certificate_no: true,
          theme: true,
          updated_at: true,
          training: {
            select: {
              name: true,
              slug: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.userTraining.count({
        where: whereCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);

    return response(
      200,
      true,
      "Data user training berhasil diambil",
      userTrainings,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve user training data", {
      error: error.message,
    });
  }
}

export async function POST(req, { params }) {
  try {
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) return response(400, false, "Invalid user ID");

    const jsonData = await req.json();
    const { training_id, certificate_no, theme } = jsonData;

    if (!training_id || !certificate_no || !theme) {
      return response(400, false, "Missing required fields");
    }

    const trainingId = Number(training_id);

    // Cek apakah training_id valid
    const trainingExists = await prisma.training.findUnique({
      where: { id: trainingId },
    });

    if (!trainingExists) {
      return response(400, false, "Training not found");
    }

    // Cek apakah kombinasi user_id dan training_id sudah ada
    const userTrainingExists = await prisma.userTraining.findFirst({
      where: {
        user_id: userId,
        training_id: trainingId,
      },
    });

    if (userTrainingExists) {
      return response(400, false, "User is already enrolled in this training");
    }

    // Cek apakah nomor sertifikat sudah digunakan
    const certificateExists = await prisma.userTraining.findFirst({
      where: { certificate_no },
    });

    if (certificateExists) {
      return response(400, false, "Certificate number already exists");
    }

    // Buat data baru
    const newUserTraining = await prisma.userTraining.create({
      data: {
        user_id: userId,
        training_id: trainingId,
        certificate_no,
        theme,
      },
    });

    return response(
      201,
      true,
      "User training successfully created",
      newUserTraining
    );
  } catch (error) {
    return response(500, false, "Failed to create user training", null, {
      error: error.message,
    });
  }
}
