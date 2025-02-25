import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";
import { validateNationalId } from "@/utils/validateNationalId";
const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const {
      page,
      limit,
      offset,
      search,
      sortField = "created_at",
      sortOrder = "desc",
    } = getQueryParams(req.url);

    const { id } = params; // ID user dari URL
    const searchCondition = buildSearchCondition("training_id", search);

    // Tambahkan filter berdasarkan ID user jika tersedia
    const whereCondition = {
      ...searchCondition,
      ...(id ? { user_id: parseInt(id, 10) } : {}), // Filter berdasarkan user_id jika ada
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

    const trainingExists = await prisma.training.findUnique({
      where: { id: Number(training_id) },
    });

    if (!trainingExists) {
      return response(400, false, "Training not found");
    }

    const certificateExists = await prisma.userTraining.findFirst({
      where: { certificate_no },
    });

    if (certificateExists) {
      return response(400, false, "Certificate number already exists");
    }

    const newUserTraining = await prisma.userTraining.create({
      data: {
        user_id: userId,
        training_id: training_id,
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
