import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import { checkSession } from "@/utils/session";

import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const sessionResponse = await checkSession(req);
    if (!sessionResponse.success) {
      return sessionResponse;
    }

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
    const sessionResponse = await checkSession(req);

    if (!sessionResponse.success) {
      return sessionResponse;
    }

    const jsonData = await req.json();
    const requiredFields = ["name", "description"];

    for (const field of requiredFields) {
      if (!jsonData[field]) return response(400, false, `${field} harus diisi`);
    }

    const { name, description } = jsonData;
    const slug = name.replace(/\s+/g, "-").toLowerCase(); // Generate slug

    const newSchemaGroup = await prisma.schemaGroup.create({
      data: { name, description, slug },
    });

    return response(201, true, "SchemaGroup berhasil dibuat", newSchemaGroup);
  } catch (error) {
    return response(500, false, "Failed to create schemaGroup", null, {
      error: error.message,
    });
  }
}
