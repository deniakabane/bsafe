import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { page, limit, offset, search, sortField, sortOrder } =
      getQueryParams(req.url);
    const searchCondition = buildSearchCondition("name", search);

    const [certificates, totalItems] = await Promise.all([
      prisma.certificate.findMany({
        where: searchCondition,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          description: true,
          status: true,
          created_at: true,
          updated_at: true,
          certificate_id: true,
          certificate: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.certificate.count({
        where: searchCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);

    return response(
      200,
      true,
      "Data certificate berhasil diambil",
      certificates,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve certificates", {
      error: error.message,
    });
  }
}

export async function POST(req) {
  try {
    const jsonData = await req.json();
    const requiredFields = ["name", "certificate_id", "price"];

    for (const field of requiredFields) {
      if (!jsonData[field]) return response(400, false, `${field} harus diisi`);
    }

    const certificate_id = parseInt(jsonData.certificate_id, 10);
    if (isNaN(certificate_id))
      return response(400, false, "certificate_id harus berupa angka");

    // Cek apakah certificate_id ada di tabel categoryCertificate
    const categoryExists = await prisma.categoryCertificate.findUnique({
      where: { id: certificate_id },
    });

    if (!categoryExists) {
      return response(
        400,
        false,
        "Invalid certificate_id: Category Certificate not found"
      );
    }

    const slug = jsonData.name.replace(/\s+/g, "-").toLowerCase(); // Generate slug

    // Gunakan findFirst() untuk cek apakah slug sudah ada
    const existingCertificate = await prisma.certificate.findFirst({
      where: { slug },
    });

    if (existingCertificate) {
      return response(400, false, "Slug sudah digunakan, gunakan nama lain.");
    }

    // Buat data baru di tabel Certificate
    const newCertificate = await prisma.certificate.create({
      data: {
        name: jsonData.name,
        slug,
        certificate_id,
        price: jsonData.price,
        description: jsonData.description || null,
        status: jsonData.status ?? true, // Default true jika tidak dikirim
      },
    });

    return response(201, true, "Certificate berhasil dibuat", newCertificate);
  } catch (error) {
    return response(500, false, "Failed to create certificate", null, {
      error: error.message,
    });
  }
}
