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
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return response(400, false, "ID schema harus berupa angka");

    const jsonData = await req.json();
    const requiredFields = ["name", "image_id", "seo_link", "schema_group_id"];

    for (const field of requiredFields) {
      if (!jsonData[field]) return response(400, false, `${field} harus diisi`);
    }

    const schema_group_id = parseInt(jsonData.schema_group_id, 10);
    if (isNaN(schema_group_id))
      return response(400, false, "schema_group_id harus berupa angka");

    // Generate slug jika name berubah
    const updateData = { ...jsonData, schema_group_id };
    if (jsonData.name) {
      updateData.slug = jsonData.name.replace(/\s+/g, "-").toLowerCase();
    }

    const updatedSchema = await prisma.schema.update({
      where: { id },
      data: updateData,
    });

    return response(200, true, "Schema berhasil diperbarui", updatedSchema);
  } catch (error) {
    return response(500, false, "Failed to update schema", null, {
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
    const schemaId = parseInt(params.id, 10);
    if (!schemaId) return response(400, false, "ID schema harus diisi");

    await prisma.schema.delete({ where: { id: schemaId } });

    return response(200, true, "Schema berhasil dihapus");
  } catch (error) {
    return response(500, false, "Failed to delete schema", null, {
      error: error.message,
    });
  }
}
