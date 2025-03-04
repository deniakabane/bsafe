import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";

const prisma = new PrismaClient();

export async function PUT(req, context) {
  try {
    const params = context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return response(400, false, "ID categoryCertificate harus berupa angka");

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

    const updatedCategoryCertificate = await prisma.categoryCertificate.update({
      where: { id },
      data: updateData,
    });

    return response(
      200,
      true,
      "categoryCertificate berhasil diperbarui",
      updatedCategoryCertificate
    );
  } catch (error) {
    console.error("Error updating categoryCertificate:", error);
    return response(500, false, "Failed to update categoryCertificate", null, {
      error: error.message,
    });
  }
}

export async function DELETE(req, context) {
  try {
    const params = context.params;
    const id = parseInt(params.id, 10);
    if (!id) return response(400, false, "ID categoryCertificate harus diisi");

    await prisma.categoryCertificate.delete({ where: { id } });

    return response(200, true, "categoryCertificate berhasil dihapus", null);
  } catch (error) {
    return response(500, false, "Failed to delete categoryCertificate", null, {
      error: error.message,
    });
  }
}
