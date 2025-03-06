import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import { validateNationalId } from "@/utils/validateNationalId";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return response(400, false, "Invalid user ID");

    const jsonData = await req.json();

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
      uniqueFields.map(async (field) => {
        const exists = await prisma.user.findFirst({
          where: {
            [field]: jsonData[field],
            id: { not: id },
          },
        });
        return { field, exists };
      })
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

    const birthDate = new Date(jsonData.birth_date);
    if (isNaN(birthDate.getTime())) {
      return response(400, false, "Invalid birth_date format (YYYY-MM-DD)");
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { ...jsonData, birth_date: birthDate },
    });

    return response(200, true, "User successfully updated", updatedUser);
  } catch (error) {
    return response(500, false, "Failed to update user", null, {
      error: error.message,
    });
  }
}

export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return response(400, false, "ID user harus berupa angka");

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return response(404, false, "user tidak ditemukan");

    return response(200, true, "Data user berhasil diambil", user);
  } catch (error) {
    return response(500, false, "Failed to retrieve user", null, {
      error: error.message,
    });
  }
}
