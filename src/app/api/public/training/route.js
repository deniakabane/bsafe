import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";
const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const {
      page,
      limit,
      offset,
      search,
      sortField = "created_at",
      sortOrder = "desc",
    } = getQueryParams(req.url);
    const searchCondition = buildSearchCondition("name", search);

    const [trainings, totalItems] = await Promise.all([
      prisma.training.findMany({
        where: searchCondition,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          start_date: true,
          end_date: true,
          price: true,
          image_id: true,
          status: true,
          schema_id: true,
          updated_at: true,
        },
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.training.count({
        where: searchCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);
    return response(
      200,
      true,
      "Data training berhasil diambil",
      trainings,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve trainings", {
      error: error.message,
    });
  }
}
