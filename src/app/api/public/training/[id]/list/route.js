import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";
const prisma = new PrismaClient();
import { checkSession } from "@/utils/session";

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
    const { id } = params;

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
          status: true,
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
