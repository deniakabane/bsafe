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
    const searchCondition = buildSearchCondition("admin_id", search);

    const [resellers, totalItems] = await Promise.all([
      prisma.reseller.findMany({
        where: searchCondition,
        select: {
          id: true,
          admin_id: true,
          name: true,
          type: true,
        },
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.reseller.count({
        where: searchCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);

    return response(
      200,
      true,
      "Data reseller berhasil diambil",
      resellers,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve resellers", {
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

    if (jsonData.admin_id) {
      const adminExists = await prisma.adminUser.findUnique({
        where: { id: jsonData.admin_id },
      });
      if (!adminExists) {
        return response(400, false, "Admin not found");
      }
      jsonData.type = "INTERNAL";
      jsonData.name = null;
    } else {
      if (!jsonData.name) {
        return response(400, false, "Missing field: name");
      }
      if (jsonData.type !== "EXTERNAL") {
        return response(400, false, "Invalid type value. Must be 'EXTERNAL'");
      }
    }

    const newReseller = await prisma.reseller.create({
      data: {
        name: jsonData.name,
        admin_id: jsonData.admin_id ?? undefined,
        type: jsonData.type,
      },
    });

    return response(201, true, "Reseller successfully created", newReseller);
  } catch (error) {
    return response(500, false, "Failed to create reseller", null, {
      error: error.message,
    });
  }
}
