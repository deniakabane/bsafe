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
    const skpId = parseInt(params.id, 10);
    if (isNaN(skpId)) return response(400, false, "ID harus berupa angka");

    const existingskp = await prisma.skp.findUnique({
      where: { id: skpId },
    });
    if (!existingskp) return response(404, false, "skp tidak ditemukan");

    const jsonData = await req.json();
    const {
      schema_id,
      start_date,
      end_date,
      price,
      type,
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

    const updatedskp = await prisma.skp.update({
      where: { id: skpId },
      data: updateData,
    });

    return response(200, true, "skp berhasil diperbarui", updatedskp);
  } catch (error) {
    return response(500, false, "Failed to update skp", null, {
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
    const skpId = parseInt(params.id, 10);
    if (!skpId) return response(400, false, "ID schema harus diisi");

    await prisma.skp.delete({ where: { id: skpId } });

    return response(200, true, "skp berhasil dihapus");
  } catch (error) {
    return response(500, false, "Failed to delete schema", null, {
      error: error.message,
    });
  }
}

export async function GET(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (!sessionResponse.success) {
      return sessionResponse;
    }
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return response(400, false, "ID skp harus berupa angka");

    const skp = await prisma.skp.findUnique({
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

    if (!skp) return response(404, false, "skp tidak ditemukan");

    return response(200, true, "Data skp berhasil diambil", skp);
  } catch (error) {
    return response(500, false, "Failed to retrieve skp", null, {
      error: error.message,
    });
  }
}
