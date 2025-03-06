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

    if (!sessionResponse.success) {
      return sessionResponse;
    }
    const { page, limit, offset, search, sortField, sortOrder } =
      getQueryParams(req.url);
    const searchCondition = buildSearchCondition("name", search);

    const [categories, totalItems] = await Promise.all([
      prisma.categoryCertificate.findMany({
        where: searchCondition,
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.categoryCertificate.count({
        where: searchCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);
    return response(
      200,
      true,
      "Data category certificate berhasil diambil",
      categories,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve category certificates", {
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
    const slug = name.replace(/\s+/g, "-").toLowerCase();

    const newCategory = await prisma.categoryCertificate.create({
      data: { name, description, slug },
    });

    return response(
      201,
      true,
      "Category certificate berhasil dibuat",
      newCategory
    );
  } catch (error) {
    return response(500, false, "Failed to create category certificate", null, {
      error: error.message,
    });
  }
}
