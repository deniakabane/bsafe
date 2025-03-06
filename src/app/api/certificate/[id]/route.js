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
    if (isNaN(id))
      return response(400, false, "ID certificate harus berupa angka");

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

    // Generate slug jika name berubah
    const updateData = { ...jsonData, certificate_id };
    if (jsonData.name) {
      const newSlug = jsonData.name.replace(/\s+/g, "-").toLowerCase();

      // Pastikan slug tidak digunakan oleh certificate lain
      const existingCertificate = await prisma.certificate.findFirst({
        where: { slug: newSlug, NOT: { id } },
      });

      if (existingCertificate) {
        return response(400, false, "Slug sudah digunakan, gunakan nama lain.");
      }

      updateData.slug = newSlug;
    }

    const updatedCertificate = await prisma.certificate.update({
      where: { id },
      data: updateData,
    });

    return response(
      200,
      true,
      "Certificate berhasil diperbarui",
      updatedCertificate
    );
  } catch (error) {
    return response(500, false, "Failed to update certificate", null, {
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
    const certificateId = parseInt(params.id, 10);
    if (!certificateId)
      return response(400, false, "ID certificate harus diisi");

    await prisma.certificate.delete({ where: { id: certificateId } });

    return response(200, true, "Certificate berhasil dihapus");
  } catch (error) {
    return response(500, false, "Failed to delete certificate", null, {
      error: error.message,
    });
  }
}

export async function GET(req, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id))
      return response(400, false, "ID certificate harus berupa angka");

    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        certificate: true,
      },
    });

    if (!certificate)
      return response(404, false, "Certificate tidak ditemukan");

    return response(200, true, "Certificate berhasil diambil", certificate);
  } catch (error) {
    return response(500, false, "Failed to retrieve certificate", null, {
      error: error.message,
    });
  }
}
