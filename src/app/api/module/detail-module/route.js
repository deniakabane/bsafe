import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";
import { checkSession } from "@/utils/session";

const prisma = new PrismaClient();

// Get All Detail Modules
export async function GET(req) {
  try {
    const sessionResponse = await checkSession(req);
    if (!sessionResponse.success) return sessionResponse;

    const { page, limit, offset, search, sortField, sortOrder } =
      getQueryParams(req.url);
    const searchCondition = buildSearchCondition("nama", search);

    const [modules, totalItems] = await Promise.all([
      prisma.detailModule.findMany({
        where: searchCondition,
        select: {
          id: true,
          nama: true,
          jumlah_halaman: true,
          file: true,
          list_kategori_id: true,
          created_at: true,
          updated_at: true,
          listKategori: { select: { nama: true } },
        },
        orderBy: { [sortField]: sortOrder },
        skip: offset,
        take: limit,
      }),
      prisma.detailModule.count({ where: searchCondition }),
    ]);

    return response(
      200,
      true,
      "Detail module berhasil diambil",
      modules,
      getPaginationMeta(totalItems, limit, page)
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve detail module", {
      error: error.message,
    });
  }
}

// Create New Detail Module
export async function POST(req) {
  try {
    const sessionResponse = await checkSession(req);
    if (!sessionResponse.success) return sessionResponse;

    const { nama, jumlah_halaman, file, list_kategori_id } = await req.json();
    if (!nama || !jumlah_halaman || !list_kategori_id || file === undefined) {
      return response(
        400,
        false,
        "Nama, jumlah_halaman, list_kategori_id, dan file wajib diisi"
      );
    }

    const newDetailModule = await prisma.detailModule.create({
      data: { nama, jumlah_halaman, file, list_kategori_id },
    });

    return response(
      201,
      true,
      "Detail module berhasil dibuat",
      newDetailModule
    );
  } catch (error) {
    return response(500, false, "Failed to create detail module", {
      error: error.message,
    });
  }
}

// Update Detail Module
export async function PUT(req) {
  try {
    const sessionResponse = await checkSession(req);
    if (!sessionResponse.success) return sessionResponse;

    const { id, nama, jumlah_halaman, file, list_kategori_id } =
      await req.json();
    if (!id) return response(400, false, "ID wajib diisi");

    const existingModule = await prisma.detailModule.findUnique({
      where: { id },
    });
    if (!existingModule)
      return response(404, false, "Detail module tidak ditemukan");

    const updatedDetailModule = await prisma.detailModule.update({
      where: { id },
      data: { nama, jumlah_halaman, file, list_kategori_id },
    });

    return response(
      200,
      true,
      "Detail module berhasil diperbarui",
      updatedDetailModule
    );
  } catch (error) {
    return response(500, false, "Failed to update detail module", {
      error: error.message,
    });
  }
}

// Delete Detail Module
export async function DELETE(req) {
  try {
    const sessionResponse = await checkSession(req);
    if (!sessionResponse.success) return sessionResponse;

    const { id } = await req.json();
    if (!id) return response(400, false, "ID wajib diisi");

    const existingModule = await prisma.detailModule.findUnique({
      where: { id },
    });
    if (!existingModule)
      return response(404, false, "Detail module tidak ditemukan");

    await prisma.detailModule.delete({ where: { id } });

    return response(200, true, "Detail module berhasil dihapus");
  } catch (error) {
    return response(500, false, "Failed to delete detail module", {
      error: error.message,
    });
  }
}
