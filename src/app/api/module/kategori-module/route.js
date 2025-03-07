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

    const [categories, totalItems] = await Promise.all([
      prisma.kategoriModule.findMany({
        where: searchCondition,
        select: {
          id: true,
          nama: true,
        },
        orderBy: { [sortField]: sortOrder },
        skip: offset,
        take: limit,
      }),
      prisma.kategoriModule.count({ where: searchCondition }),
    ]);

    return response(
      200,
      true,
      "Kategori module berhasil diambil",
      categories,
      getPaginationMeta(totalItems, limit, page)
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve kategori module", {
      error: error.message,
    });
  }
}

export async function POST(req) {
  try {
    const sessionResponse = await checkSession(req);
    if (!sessionResponse.success) return sessionResponse;

    const { nama } = await req.json();
    if (!nama) return response(400, false, "Nama kategori wajib diisi");

    const newKategori = await prisma.kategoriModule.create({ data: { nama } });
    return response(201, true, "Kategori module berhasil dibuat", newKategori);
  } catch (error) {
    return response(500, false, "Failed to create kategori module", {
      error: error.message,
    });
  }
}
export async function PUT(req) {
  try {
    const sessionResponse = await checkSession(req);
    if (!sessionResponse.success) return sessionResponse;

    const { id, nama } = await req.json();
    if (!id || !nama)
      return response(400, false, "ID dan nama kategori wajib diisi");

    const updatedKategori = await prisma.kategoriModule.update({
      where: { id },
      data: { nama },
    });

    return response(
      200,
      true,
      "Kategori module berhasil diperbarui",
      updatedKategori
    );
  } catch (error) {
    return response(500, false, "Failed to update kategori module", {
      error: error.message,
    });
  }
}

export async function DELETE(req) {
  try {
    const sessionResponse = await checkSession(req);
    if (!sessionResponse.success) return sessionResponse;

    const { id } = await req.json();
    if (!id) return response(400, false, "ID kategori wajib diisi");

    await prisma.kategoriModule.delete({ where: { id } });

    return response(200, true, "Kategori module berhasil dihapus");
  } catch (error) {
    return response(500, false, "Failed to delete kategori module", {
      error: error.message,
    });
  }
}
