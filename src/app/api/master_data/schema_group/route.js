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

    const [schemas_group, totalItems] = await Promise.all([
      prisma.schemaGroup.findMany({
        where: searchCondition,
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.schemaGroup.count({
        where: searchCondition,
      }),
    ]);
    const pagination = getPaginationMeta(totalItems, limit, page);
    return response(
      200,
      true,
      "Data schemagroup berhasil diambil",
      schemas_group,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve schemas_group", {
      error: error.message,
    });
  }
}

export async function POST(req) {
  try {
    const { name, description } = Object.fromEntries(await req.formData());
    if (!name) return response(400, false, "name schemaGroup harus diisi");

    const newSchemaGroup = await prisma.schemaGroup.create({
      data: { name, description: description || null },
    });
    return response(
      201,
      true,
      "SchemaGroup berhasil dibuat",
      newSchemaGroup,
      null
    );
  } catch (error) {
    console.error("Error creating schemaGroup:", error);
    return response(500, false, "Failed to create schemaGroup", null, {
      error: error.message,
    });
  }
}
