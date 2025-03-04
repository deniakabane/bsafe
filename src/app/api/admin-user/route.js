import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";
import { validateNationalId } from "@/utils/validateNationalId";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { page, limit, offset, search, sortField, sortOrder } =
      getQueryParams(req.url);
    const searchCondition = buildSearchCondition("name", search);

    const [adminUsers, totalItems] = await Promise.all([
      prisma.adminUser.findMany({
        where: searchCondition,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.adminUser.count({
        where: searchCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);

    return response(
      200,
      true,
      "Data admin user berhasil diambil",
      adminUsers,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve admin users", {
      error: error.message,
    });
  }
}

export async function POST(req) {
  try {
    const jsonData = await req.json();

    const requiredFields = [
      "name",
      "email",
      "phone",
      "full_address",
      "national_id_number",
      "gender",
      "blood_type",
      "password",
      "birth_place",
      "birth_date",
      "religion",
      "domicile_province",
      "domicile_city",
      "last_education",
    ];

    const missingFields = requiredFields.filter((field) => !jsonData[field]);
    if (missingFields.length) {
      return response(
        400,
        false,
        `Missing fields: ${missingFields.join(", ")}`
      );
    }

    const idError = validateNationalId(jsonData.national_id_number);
    if (idError) return response(400, false, idError);

    const uniqueFields = ["email", "phone", "national_id_number"];
    const duplicates = await Promise.all(
      uniqueFields.map(async (field) => ({
        field,
        exists: await prisma.adminUser.findFirst({
          where: { [field]: jsonData[field] },
        }),
      }))
    );

    const duplicateFields = duplicates
      .filter((check) => check.exists)
      .map((check) => check.field);
    if (duplicateFields.length) {
      return response(
        400,
        false,
        `Duplicate fields: ${duplicateFields.join(", ")}`
      );
    }

    const newAdminUser = await prisma.adminUser.create({
      data: {
        ...jsonData,
        birth_date: new Date(jsonData.birth_date),
      },
    });

    return response(201, true, "Admin user successfully created", newAdminUser);
  } catch (error) {
    return response(500, false, "Failed to create admin user", null, {
      error: error.message,
    });
  }
}
