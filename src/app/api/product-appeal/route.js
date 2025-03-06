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
    const {
      page,
      limit,
      offset,
      search,
      sortField = "created_at",
      sortOrder = "desc",
    } = getQueryParams(req.url);

    const searchCondition = buildSearchCondition("name", search);

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

    const pagination = getPaginationMeta(totalItems, limit, page);

    return response(
      200,
      true,
      "Data product appeal berhasil diambil",
      products,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve product appeals", {
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
    const { name, price, status } = jsonData;

    if (!name || price == null || !status) {
      return response(400, false, "Name, price, dan status harus diisi");
    }

    const newProductAppeal = await prisma.productAppeal.create({
      data: {
        name,
        price: parseFloat(price),
        status,
      },
    });

    return response(
      201,
      true,
      "Product appeal berhasil dibuat",
      newProductAppeal
    );
  } catch (error) {
    return response(500, false, "Failed to create product appeal", null, {
      error: error.message,
    });
  }
}
