import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id, 10);
    if (!id) return response(400, false, "ID schema harus diisi");

    const formData = Object.fromEntries(await req.formData());
    const requiredFields = ["name", "image", "seo_link", "schema_group_id"];

    for (const field of requiredFields) {
      if (!formData[field]) return response(400, false, `${field} harus diisi`);
    }

    const schema_group_id = parseInt(formData.schema_group_id, 10);
    if (isNaN(schema_group_id))
      return response(400, false, "schema_group_id harus berupa angka");

    const updatedSchema = await prisma.schema.update({
      where: { id },
      data: { ...formData, schema_group_id },
    });

    return response(200, true, "Schema berhasil diperbarui", updatedSchema);
  } catch (error) {
    return response(500, false, "Failed to update schema", null, {
      error: error.message,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const schemaId = parseInt(id, 10);
    if (!schemaId) return response(400, false, "ID schema harus diisi");

    await prisma.schema.delete({ where: { id: schemaId } });

    return response(200, true, "Schema berhasil dihapus");
  } catch (error) {
    return response(500, false, "Failed to delete schema", null, {
      error: error.message,
    });
  }
}
