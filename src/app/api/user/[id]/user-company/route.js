import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";
const prisma = new PrismaClient();
import { checkSession } from "@/utils/session";

export async function GET(req, { params }) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) return response(400, false, "Invalid user ID");

    const {
      page,
      limit,
      offset,
      search,
      sortField = "created_at",
      sortOrder = "desc",
    } = getQueryParams(req.url);

    const whereCondition = {
      user_id: userId,
      ...(search ? buildSearchCondition("company_id", search) : {}),
    };

    const [userCompanies, totalItems] = await Promise.all([
      prisma.userCompany.findMany({
        where: whereCondition,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.userCompany.count({
        where: whereCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);

    return response(
      200,
      true,
      "Data user company berhasil diambil",
      userCompanies,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve user company data", {
      error: error.message,
    });
  }
}

export async function POST(req, { params }) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) return response(400, false, "Invalid user ID");

    const jsonData = await req.json();
    const { company_id, still_working = true } = jsonData;

    if (!company_id) {
      return response(400, false, "Company ID is required");
    }

    const companyId = Number(company_id);

    // Cek apakah company_id valid
    const companyExists = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!companyExists) {
      return response(400, false, "Company not found");
    }

    // Cek apakah kombinasi user_id dan company_id sudah ada
    const userCompanyExists = await prisma.userCompany.findFirst({
      where: {
        user_id: userId,
        company_id: companyId,
      },
    });

    if (userCompanyExists) {
      return response(
        400,
        false,
        "User is already associated with this company"
      );
    }

    // Buat data baru
    const newUserCompany = await prisma.userCompany.create({
      data: {
        user_id: userId,
        company_id: companyId,
        still_working,
      },
    });

    return response(
      201,
      true,
      "User company successfully created",
      newUserCompany
    );
  } catch (error) {
    return response(500, false, "Failed to create user company", null, {
      error: error.message,
    });
  }
}
