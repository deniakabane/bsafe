import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const trainingId = parseInt(params.id, 10);
    if (isNaN(trainingId)) return response(400, false, "ID harus berupa angka");

    const existingTraining = await prisma.training.findUnique({
      where: { id: trainingId },
    });
    if (!existingTraining)
      return response(404, false, "Training tidak ditemukan");

    const jsonData = await req.json();
    const { schema_id, start_date, end_date, price, name, ...updateData } =
      jsonData;

    if (schema_id) {
      const schemaId = parseInt(schema_id, 10);
      if (
        isNaN(schemaId) ||
        !(await prisma.schema.findUnique({ where: { id: schemaId } }))
      ) {
        return response(400, false, "Invalid schema_id");
      }
      updateData.schema_id = schemaId;
    }

    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
      return response(400, false, "Start date tidak boleh lebih dari end date");
    }

    if (start_date) updateData.start_date = new Date(start_date);
    if (end_date) updateData.end_date = new Date(end_date);
    if (price) updateData.price = parseFloat(price);

    if (name) {
      updateData.name = name;
      updateData.slug = name.replace(/\s+/g, "-").toLowerCase();
    }

    const updatedTraining = await prisma.training.update({
      where: { id: trainingId },
      data: updateData,
    });

    return response(200, true, "Training berhasil diperbarui", updatedTraining);
  } catch (error) {
    return response(500, false, "Failed to update training", null, {
      error: error.message,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const trainingId = parseInt(id, 10);
    if (!trainingId) return response(400, false, "ID schema harus diisi");

    await prisma.training.delete({ where: { id: trainingId } });

    return response(200, true, "Training berhasil dihapus");
  } catch (error) {
    return response(500, false, "Failed to delete schema", null, {
      error: error.message,
    });
  }
}
