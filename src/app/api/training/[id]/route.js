import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import { checkSession } from "@/utils/session";

const prisma = new PrismaClient();

export async function PUT(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const params = await context.params;
    const trainingId = parseInt(params.id, 10);
    if (isNaN(trainingId)) return response(400, false, "ID harus berupa angka");

    const existingTraining = await prisma.training.findUnique({
      where: { id: trainingId },
    });
    if (!existingTraining)
      return response(404, false, "Training tidak ditemukan");

    const jsonData = await req.json();
    const {
      schema_id,
      start_date,
      end_date,
      price,
      status,
      image_id,
      name,
      ...updateData
    } = jsonData;

    // Validasi schema_id jika ada
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

    // Validasi tanggal
    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
      return response(400, false, "Start date tidak boleh lebih dari end date");
    }

    if (start_date) updateData.start_date = new Date(start_date);
    if (end_date) updateData.end_date = new Date(end_date);
    if (price) updateData.price = parseFloat(price);

    // Validasi image_id jika ada
    if (image_id) {
      const imageId = parseInt(image_id, 10);
      if (isNaN(imageId)) {
        return response(400, false, "Invalid image_id");
      }
      updateData.image_id = imageId;
    }

    // Validasi status jika ada
    if (status !== undefined) {
      if (typeof status !== "boolean") {
        return response(400, false, "Status harus berupa boolean (true/false)");
      }
      updateData.status = status;
    }

    // Update slug jika name diubah
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

export async function DELETE(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const params = await context.params;
    const trainingId = parseInt(params.id, 10);
    if (!trainingId) return response(400, false, "ID schema harus diisi");

    await prisma.training.delete({ where: { id: trainingId } });

    return response(200, true, "Training berhasil dihapus");
  } catch (error) {
    return response(500, false, "Failed to delete schema", null, {
      error: error.message,
    });
  }
}

export async function GET(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return response(400, false, "ID training harus berupa angka");

    const training = await prisma.training.findUnique({
      where: { id },
      include: {
        schema: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!training) return response(404, false, "Training tidak ditemukan");

    return response(200, true, "Data training berhasil diambil", training);
  } catch (error) {
    return response(500, false, "Failed to retrieve training", null, {
      error: error.message,
    });
  }
}
