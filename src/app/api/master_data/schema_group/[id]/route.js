import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (!id) return response(400, false, "ID schemaGroup harus diisi");

    const formData = Object.fromEntries(await req.formData());
    const requiredFields = ["name", "description"];

    for (const field of requiredFields) {
      if (!formData[field]) return response(400, false, `${field} harus diisi`);
    }

    const { name, description } = formData;

    const updatedSchemaGroup = await prisma.schemaGroup.update({
      where: { id },
      data: { name, description },
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

export async function DELETE(req, { params }) {
  try {
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
