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

    // Ambil product appeal beserta training yang terkait
    const [products, totalItems] = await Promise.all([
      prisma.productAppeal.findMany({
        where: searchCondition,
        select: {
          id: true,
          name: true,
          price: true,
          status: true,
          created_at: true,
          updated_at: true,
          productAppealTrainings: {
            select: {
              training: {
                select: {
                  id: true,
                  name: true,
                  // Hapus `category`, tambahkan field yang valid
                  slug: true,
                  description: true,
                  start_date: true,
                  end_date: true,
                  price: true,
                  status: true,
                },
              },
            },
          },
        },
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.productAppeal.count({
        where: searchCondition,
      }),
    ]);

    // Format data agar lebih rapi
    const formattedProducts = products.map((product) => ({
      ...product,
      trainings: product.productAppealTrainings.map((t) => t.training),
    }));

    const pagination = getPaginationMeta(totalItems, limit, page);

    return response(
      200,
      true,
      "Data product appeal berhasil diambil",
      formattedProducts,
      pagination
    );
  } catch (error) {
    console.error("🔥 Error fetching product appeals:", error);
    return response(500, false, "Failed to retrieve product appeals", {
      error: error.message,
    });
  }
}
