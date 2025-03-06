import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import { validateNationalId } from "@/utils/validateNationalId";

const prisma = new PrismaClient();
import { checkSession } from "@/utils/session";

export async function PUT(req, { params }) {
  try {
    const sessionResponse = await checkSession(req);

    if (!sessionResponse.success) {
      return sessionResponse;
    }
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return response(400, false, "Invalid admin user ID");

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
      "level",
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
        const exists = await prisma.adminUser.findFirst({
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

    const updatedAdminUser = await prisma.adminUser.update({
      where: { id },
      data: { ...jsonData, birth_date: birthDate },
    });

    return response(
      200,
      true,
      "Admin user successfully updated",
      updatedAdminUser
    );
  } catch (error) {
    console.error("Error updating admin user:", error);
    return response(500, false, "Failed to update admin user", null, {
      error: error.message,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const sessionResponse = await checkSession(req);

    if (!sessionResponse.success) {
      return sessionResponse;
    }
    const adminUserId = parseInt(params.id, 10);

    if (isNaN(adminUserId)) {
      return response(400, false, "Invalid admin user ID");
    }

    const adminUserExists = await prisma.adminUser.findUnique({
      where: { id: adminUserId },
    });

    if (!adminUserExists) {
      return response(404, false, "Admin user not found");
    }

    await prisma.adminUser.delete({
      where: { id: adminUserId },
    });

    return response(200, true, "Admin user successfully deleted");
  } catch (error) {
    return response(500, false, "Failed to delete admin user", null, {
      error: error.message,
    });
  }
}

export async function GET(req, { params }) {
  try {
    const sessionResponse = await checkSession(req);

    if (!sessionResponse.success) {
      return sessionResponse;
    }
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return response(400, false, "ID admin user harus berupa angka");

    const adminUser = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!adminUser) return response(404, false, "Admin user tidak ditemukan");

    return response(200, true, "Data admin user berhasil diambil", adminUser);
  } catch (error) {
    return response(500, false, "Failed to retrieve admin user", null, {
      error: error.message,
    });
  }
}
