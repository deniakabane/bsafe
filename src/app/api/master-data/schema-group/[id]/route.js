import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import { checkSession } from "@/utils/session";

const prisma = new PrismaClient();

export async function PUT(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (!sessionResponse.success) {
      return sessionResponse;
    }
    const params = await context.params; // Tambahkan await
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return response(400, false, "ID schemaGroup harus berupa angka");

    const jsonData = await req.json();
    const requiredFields = ["name", "description"];

    for (const field of requiredFields) {
      if (!jsonData[field]) return response(400, false, `${field} harus diisi`);
    }

    const { name, description } = jsonData;

    const updateData = { name, description };
    if (name) {
      updateData.slug = name.replace(/\s+/g, "-").toLowerCase();
    }

    const updatedSchemaGroup = await prisma.schemaGroup.update({
      where: { id },
      data: updateData,
    });

    return response(
      200,
      true,
      "SchemaGroup berhasil diperbarui",
      updatedSchemaGroup
    );
  } catch (error) {
    console.error("Error updating schemaGroup:", error);
    return response(500, false, "Failed to update schemaGroup", null, {
      error: error.message,
    });
  }
}

export async function DELETE(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (!sessionResponse.success) {
      return sessionResponse;
    }
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (!id) return response(400, false, "ID schemaGroup harus diisi");

    await prisma.schemaGroup.delete({ where: { id } });

    return response(200, true, "SchemaGroup berhasil dihapus", null);
  } catch (error) {
    return response(500, false, "Failed to delete schemaGroup", null, {
      error: error.message,
    });
  }
}
