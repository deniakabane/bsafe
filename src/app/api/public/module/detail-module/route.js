import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";
import { checkSessionUser } from "@/utils/sessionuser";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const session = await checkSessionUser();

    if (!session.success) {
      return NextResponse.json(
        { success: false, message: session.message },
        { status: 401 }
      );
    }
    const { page, limit, offset, search, sortField, sortOrder } =
      getQueryParams(req.url);
    const searchCondition = buildSearchCondition("nama", search);

    const [modules, totalItems] = await Promise.all([
      prisma.detailModule.findMany({
        where: searchCondition,
        select: {
          id: true,
          nama: true,
          jumlah_halaman: true,
          file: true,
          list_kategori_id: true,
          created_at: true,
          updated_at: true,
          listKategori: { select: { nama: true } },
        },
        orderBy: { [sortField]: sortOrder },
        skip: offset,
        take: limit,
      }),
      prisma.detailModule.count({ where: searchCondition }),
    ]);

    return response(
      200,
      true,
      "Detail module berhasil diambil",
      modules,
      getPaginationMeta(totalItems, limit, page)
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve detail module", {
      error: error.message,
    });
  }
}
