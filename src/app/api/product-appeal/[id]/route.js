import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";

const prisma = new PrismaClient();

export async function PUT(req, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return response(400, false, "ID product appeal harus berupa angka");

    const jsonData = await req.json();
    const { name, price, status } = jsonData;

    if (!name || price === undefined || status === undefined) {
      return response(400, false, "Semua field wajib diisi");
    }

    const updatedProductAppeal = await prisma.productAppeal.update({
      where: { id },
      data: { name, price, status },
    });

    return response(
      200,
      true,
      "Product appeal berhasil diperbarui",
      updatedProductAppeal
    );
  } catch (error) {
    return response(500, false, "Failed to update product appeal", null, {
      error: error.message,
    });
  }
}

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const productAppealId = parseInt(params.id, 10);
    if (isNaN(productAppealId))
      return response(400, false, "ID product appeal harus berupa angka");

    await prisma.productAppeal.delete({ where: { id: productAppealId } });

    return response(200, true, "Product appeal berhasil dihapus");
  } catch (error) {
    return response(500, false, "Failed to delete product appeal", null, {
      error: error.message,
    });
  }
}

export async function GET(req, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return response(400, false, "ID product appeal harus berupa angka");

    const productAppeal = await prisma.productAppeal.findUnique({
      where: { id },
    });

    if (!productAppeal)
      return response(404, false, "Product appeal tidak ditemukan");

    return response(
      200,
      true,
      "Data product appeal berhasil diambil",
      productAppeal
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve product appeal", null, {
      error: error.message,
    });
  }
}
