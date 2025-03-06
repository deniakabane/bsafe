import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";
import { checkSession } from "@/utils/session";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const { page, limit, offset, search, sortField, sortOrder } =
      getQueryParams(req.url);
    const searchCondition = buildSearchCondition("name", search);

    const [schemas, totalItems] = await Promise.all([
      prisma.schema.findMany({
        where: searchCondition,
        select: {
          id: true,
          name: true,
          image_id: true,
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
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const jsonData = await req.json();
    const requiredFields = ["name", "image_id", "seo_link", "schema_group_id"];

    for (const field of requiredFields) {
      if (!jsonData[field]) return response(400, false, `${field} harus diisi`);
    }

    const schema_group_id = parseInt(jsonData.schema_group_id, 10);
    if (isNaN(schema_group_id))
      return response(400, false, "schema_group_id harus berupa angka");

    // Cek apakah schema_group_id ada di tabel SchemaGroup
    const schemaGroupExists = await prisma.schemaGroup.findUnique({
      where: { id: schema_group_id },
    });

    if (!schemaGroupExists) {
      return response(
        400,
        false,
        "Invalid schema_group_id: SchemaGroup not found"
      );
    }

    const slug = jsonData.name.replace(/\s+/g, "-").toLowerCase(); // Generate slug

    // Buat data baru di tabel Schema
    const newSchema = await prisma.schema.create({
      data: {
        name: jsonData.name,
        image_id: jsonData.image_id,
        seo_link: jsonData.seo_link,
        schema_group_id,
        slug,
      },
    });

    return response(201, true, "Schema berhasil dibuat", newSchema);
  } catch (error) {
    return response(500, false, "Failed to create schema", null, {
      error: error.message,
    });
  }
}
