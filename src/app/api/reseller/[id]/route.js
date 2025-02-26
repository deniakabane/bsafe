import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";

const prisma = new PrismaClient();

export async function PUT(req, context) {
  try {
    const params = await context.params;

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return response(400, false, "Invalid reseller ID");

    const jsonData = await req.json();

    if (jsonData.admin_id) {
      const adminExists = await prisma.adminUser.findUnique({
        where: { id: jsonData.admin_id },
      });
      if (!adminExists) {
        return response(400, false, "Admin not found");
      }
      const existingReseller = await prisma.reseller.findFirst({
        where: {
          admin_id: jsonData.admin_id,
          id: { not: id },
        },
      });
      if (existingReseller) {
        return response(
          400,
          false,
          "Admin is already assigned to another reseller"
        );
      }
      jsonData.type = "internal";
      jsonData.name = null;
    } else {
      if (!jsonData.name) {
        return response(400, false, "Missing field: name");
      }
      jsonData.type = "external";
    }

    const updatedReseller = await prisma.reseller.update({
      where: { id },
      data: jsonData,
    });

    return response(
      200,
      true,
      "Reseller successfully updated",
      updatedReseller
    );
  } catch (error) {
    return response(500, false, "Failed to update reseller", null, {
      error: error.message,
    });
  }
}

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return response(400, false, "Invalid reseller ID");

    const resellerExists = await prisma.reseller.findUnique({ where: { id } });
    if (!resellerExists) return response(404, false, "Reseller not found");

    await prisma.reseller.delete({ where: { id } });

    return response(200, true, "Reseller successfully deleted");
  } catch (error) {
    return response(500, false, "Failed to delete reseller", null, {
      error: error.message,
    });
  }
}

export async function GET(req, context) {
  try {
    const params = await context.params;

    const id = parseInt(params.id, 10);
    if (isNaN(id)) return response(400, false, "Invalid reseller ID");

    const reseller = await prisma.reseller.findUnique({
      where: { id },
    });

    if (!reseller) return response(404, false, "Reseller not found");

    return response(
      200,
      true,
      "Reseller details retrieved successfully",
      reseller
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve reseller details", {
      error: error.message,
    });
  }
}
