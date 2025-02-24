import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import { validateNationalId } from "@/utils/validateNationalId";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return response(400, false, "Invalid user ID");

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

    const idError = validateNationalId(formData.national_id_number);
    if (idError) return response(400, false, idError);

    const uniqueFields = ["name", "email", "phone", "national_id_number"];
    const duplicates = await Promise.all(
      uniqueFields.map(async (field) => ({
        field,
        exists: await prisma.user.findFirst({
          where: {
            [field]: formData[field],
            id: { not: id },
          },
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

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { ...formData, birth_date: new Date(formData.birth_date) },
    });

    return response(200, true, "User successfully updated", updatedUser);
  } catch (error) {
    return response(500, false, "Failed to update user", null, {
      error: error.message,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);
    if (!userId) return response(400, false, "ID schema harus diisi");

    await prisma.user.delete({ where: { id: userId } });

    return response(200, true, "User berhasil dihapus");
  } catch (error) {
    return response(500, false, "Failed to delete schema", null, {
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
