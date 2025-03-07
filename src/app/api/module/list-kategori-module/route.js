import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";
import { checkSession } from "@/utils/session";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const sessionResponse = await checkSession(req);
    if (!sessionResponse.success) return sessionResponse;

    const { page, limit, offset, search, sortField, sortOrder } =
      getQueryParams(req.url);
    const searchCondition = buildSearchCondition("nama", search);

    const [listCategories, totalItems] = await Promise.all([
      prisma.listKategoriModule.findMany({
        where: searchCondition,
        select: {
          id: true,
          nama: true,
          kategori_id: true,
          kategoriModule: { select: { nama: true } },
        },
        orderBy: { [sortField]: sortOrder },
        skip: offset,
        take: limit,
      }),
      prisma.listKategoriModule.count({ where: searchCondition }),
    ]);

    return response(
      200,
      true,
      "List kategori module berhasil diambil",
      listCategories,
      getPaginationMeta(totalItems, limit, page)
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve list kategori module", {
      error: error.message,
    });
  }
}

export async function POST(req) {
  try {
    const sessionResponse = await checkSession(req);
    if (!sessionResponse.success) return sessionResponse;

    const { nama, kategori_id } = await req.json();
    if (!nama || !kategori_id)
      return response(400, false, "Nama dan kategori_id wajib diisi");

    const newListKategori = await prisma.listKategoriModule.create({
      data: { nama, kategori_id },
    });
    return response(
      201,
      true,
      "List kategori module berhasil dibuat",
      newListKategori
    );
  } catch (error) {
    return response(500, false, "Failed to create list kategori module", {
      error: error.message,
    });
  }
}
export async function PUT(req) {
  try {
    const sessionResponse = await checkSession(req);
    if (!sessionResponse.success) return sessionResponse;

    const { id, nama, kategori_id } = await req.json();
    if (!id || !nama || !kategori_id)
      return response(400, false, "ID, nama, dan kategori_id wajib diisi");

    const existingKategori = await prisma.listKategoriModule.findUnique({
      where: { id },
    });

    if (!existingKategori) {
      return response(404, false, "List kategori module tidak ditemukan");
    }

    const updatedListKategori = await prisma.listKategoriModule.update({
      where: { id },
      data: { nama, kategori_id },
    });

    return response(
      200,
      true,
      "List kategori module berhasil diperbarui",
      updatedListKategori
    );
  } catch (error) {
    return response(500, false, "Failed to update list kategori module", {
      error: error.message,
    });
  }
}

export async function DELETE(req) {
  try {
    const sessionResponse = await checkSession(req);
    if (!sessionResponse.success) return sessionResponse;

    const { id } = await req.json();
    if (!id) return response(400, false, "ID list kategori wajib diisi");

    // Cek apakah list kategori masih digunakan di detail_module
    const relatedDetail = await prisma.detailModule.findFirst({
      where: { list_kategori_id: id },
    });

    if (relatedDetail) {
      return response(
        400,
        false,
        "List kategori tidak bisa dihapus karena masih digunakan dalam detail module"
      );
    }

    await prisma.listKategoriModule.delete({ where: { id } });

    return response(200, true, "List kategori module berhasil dihapus");
  } catch (error) {
    return response(500, false, "Failed to delete list kategori module", {
      error: error.message,
    });
  }
}
