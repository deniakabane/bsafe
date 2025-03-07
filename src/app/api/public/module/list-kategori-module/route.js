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

    const [listCategories, totalItems] = await Promise.all([
      prisma.listKategoriModule.findMany({
        where: searchCondition,
        select: {
          id: true,
          nama: true,
          kategori_id: true,
          kategoriModule: { select: { nama: true } },
        },
        orderBy: { [sortField]: sortOrder },
        skip: offset,
        take: limit,
      }),
      prisma.listKategoriModule.count({ where: searchCondition }),
    ]);

    return response(
      200,
      true,
      "List kategori module berhasil diambil",
      listCategories,
      getPaginationMeta(totalItems, limit, page)
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve list kategori module", {
      error: error.message,
    });
  }
}
