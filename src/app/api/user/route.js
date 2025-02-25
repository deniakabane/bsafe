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

    const [users, totalItems] = await Promise.all([
      prisma.user.findMany({
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
      prisma.user.count({
        where: searchCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);

    return response(200, true, "Data user berhasil diambil", users, pagination);
  } catch (error) {
    return response(500, false, "Failed to retrieve users", {
      error: error.message,
    });
  }
}

export async function POST(req) {
  try {
    const formData = Object.fromEntries(await req.formData());

    const requiredFields = [
      "name",
      "email",
      "phone",
      "full_address",
      "national_id_number",
      "gender",
      "blood_type",
      "birth_place",
      "birth_date",
      "religion",
      "domicile_province",
      "domicile_city",
      "last_education",
      "registration_type",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length) {
      return response(
        400,
        false,
        `Missing fields: ${missingFields.join(", ")}`
      );
    }

    // Validate national_id_number
    const idError = validateNationalId(formData.national_id_number);
    if (idError) return response(400, false, idError);

    // Check for duplicate values in unique fields
    const uniqueFields = ["name", "email", "phone", "national_id_number"];
    const duplicates = await Promise.all(
      uniqueFields.map(async (field) => ({
        field,
        exists: await prisma.user.findUnique({
          where: { [field]: formData[field] },
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

    const newUser = await prisma.user.create({
      data: { ...formData, birth_date: new Date(formData.birth_date) },
    });

    return response(201, true, "User successfully created", newUser);
  } catch (error) {
    return response(500, false, "Failed to create user", null, {
      error: error.message,
    });
  }
}
