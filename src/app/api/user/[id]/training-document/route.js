import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import { checkSession } from "@/utils/session";

const prisma = new PrismaClient();

export async function GET(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const params = await context.params;
    const userId = parseInt(params.id, 10);
    if (isNaN(userId))
      return response(400, false, "ID user harus berupa angka");

    const searchParams = req.nextUrl.searchParams;
    const training_id = searchParams.get("training_id");
    const skp_id = searchParams.get("skp_id");

    let filter = { document: { user_id: userId } };

    if (training_id) {
      filter.training_id = parseInt(training_id, 10);
    } else if (skp_id) {
      filter.skp_id = parseInt(skp_id, 10);
    }

    const userDocuments = await prisma.userDocument.findMany({
      where: filter,
      include: {
        document: true,
        training: true,
        skp: true,
        type: true,
      },
    });

    if (!userDocuments.length)
      return response(404, false, "Dokumen tidak ditemukan untuk user ini");

    return response(200, true, "Dokumen berhasil diambil", userDocuments);
  } catch (error) {
    console.error("Error retrieving documents:", error);
    return response(500, false, "Failed to retrieve documents", null, {
      error: error.message,
    });
  }
}

export async function PUT(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const body = await req.json();
    const params = await context.params;
    const user_id = parseInt(params.id, 10);
    if (isNaN(user_id))
      return response(400, false, "ID user harus berupa angka");

    let { training_id, skp_id, document_id, type_id, file_url } = body;

    if (!type_id) {
      return response(400, false, "Field type_id wajib diisi");
    }

    if (!document_id) {
      const latestDocument = await prisma.masterDocument.findFirst({
        where: { user_id },
        orderBy: { created_at: "desc" },
      });
      if (!latestDocument) {
        return response(
          404,
          false,
          "Dokumen default tidak ditemukan untuk user ini"
        );
      }
      document_id = latestDocument.id;
    }

    let newDocumentId = document_id;
    if (file_url) {
      const newDocument = await prisma.masterDocument.create({
        data: {
          user_id,
          name: `Dokumen Baru - ${new Date().toISOString()}`,
          url: file_url,
          type: "updated",
          status: true,
        },
      });
      newDocumentId = newDocument.id;
    }

    const existingUserDocument = await prisma.userDocument.findFirst({
      where: {
        document_id,
        user_id,
        type_id,
        training_id: training_id ?? null,
        skp_id: skp_id ?? null,
      },
    });

    if (existingUserDocument) {
      const updatedUserDocument = await prisma.userDocument.update({
        where: { id: existingUserDocument.id },
        data: { training_id, skp_id, type_id, document_id: newDocumentId },
      });
      return response(
        200,
        true,
        "Dokumen berhasil diperbarui",
        updatedUserDocument
      );
    }

    const newUserDocument = await prisma.userDocument.create({
      data: {
        user_id,
        training_id,
        skp_id,
        document_id: newDocumentId,
        type_id,
      },
    });

    return response(201, true, "Dokumen berhasil dibuat", newUserDocument);
  } catch (error) {
    console.error("Error updating/creating user document:", error);
    return response(500, false, "Failed to update/create user document", null, {
      error: error.message,
    });
  }
}
