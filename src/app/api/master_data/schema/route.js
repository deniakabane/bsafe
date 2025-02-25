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

export async function POST(req) {
  try {
    const formData = Object.fromEntries(await req.formData());
    const requiredFields = ["name", "image", "seo_link", "schema_group_id"];

    for (const field of requiredFields) {
      if (!formData[field]) return response(400, false, `${field} harus diisi`);
    }

    const schema_group_id = parseInt(formData.schema_group_id, 10);
    if (isNaN(schema_group_id))
      return response(400, false, "schema_group_id harus berupa angka");

    const newSchema = await prisma.schema.create({
      data: { ...formData, schema_group_id },
    });

    return response(201, true, "Schema berhasil dibuat", newSchema);
  } catch (error) {
    return response(500, false, "Failed to create schema", null, {
      error: error.message,
    });
  }
}
