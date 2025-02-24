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
    const searchCondition = buildSearchCondition("name", search);

    const [schemas, totalItems] = await Promise.all([
      prisma.schema.findMany({
        where: searchCondition,
        select: {
          name: true,
          image: true,
          description: true,
          seo_link: true,
          image_path: true,
          updated_at: true,
          schema_group_id: true,
          schemaGroup: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.schema.count({
        where: searchCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);

    return response(
      200,
      true,
      "Data schema berhasil diambil",
      schemas,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve schemas", {
      error: error.message,
    });
  }
}
