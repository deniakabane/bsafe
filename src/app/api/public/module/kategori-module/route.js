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
    const { page, limit, offset, search, sortField, sortOrder } =
      getQueryParams(req.url);
    const searchCondition = buildSearchCondition("nama", search);

    const [categories, totalItems] = await Promise.all([
      prisma.kategoriModule.findMany({
        where: searchCondition,
        select: {
          id: true,
          nama: true,
        },
        orderBy: { [sortField]: sortOrder },
        skip: offset,
        take: limit,
      }),
      prisma.kategoriModule.count({ where: searchCondition }),
    ]);

    return response(
      200,
      true,
      "Kategori module berhasil diambil",
      categories,
      getPaginationMeta(totalItems, limit, page)
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve kategori module", {
      error: error.message,
    });
  }
}
