import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";

const prisma = new PrismaClient();

export async function GET(req, context) {
  try {
    const params = await context.params;
    const user_id = parseInt(params.id, 10);
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (isNaN(user_id)) {
      return response(400, false, "User ID tidak valid");
    }

    const validTypes = ["TRAINING", "SKP"];
    if (type && !validTypes.includes(type)) {
      return response(400, false, "Type harus TRAINING atau SKP");
    }

    const documents = await prisma.masterDocument.findMany({
      where: {
        user_id,
        ...(type && { type }),
      },
    });

    return response(200, true, "Data ditemukan", documents);
  } catch (error) {
    return response(500, false, "Terjadi kesalahan", { error: error.message });
  }
}

// export async function PUT(req, { params }) {
//   try {
//     const id = parseInt(params.id, 10);
//     const user_id = parseInt(params.user_id, 10);
//     const jsonData = await req.json();
//     const { name, url, status, training_id, skp_id } = jsonData;

//     if (!id || !user_id || !name) {
//       return response(400, false, "ID, User ID, dan Name wajib diisi");
//     }

//     const existingDocument = await prisma.masterDocument.findFirst({
//       where: { id, user_id, name },
//     });

//     if (!existingDocument) {
//       return response(
//         404,
//         false,
//         "Master Document dengan User ID dan Name tidak ditemukan"
//       );
//     }

//     if (training_id && skp_id) {
//       return response(
//         400,
//         false,
//         "Training ID dan SKP ID tidak boleh diisi bersamaan"
//       );
//     }

//     let type = "USER";
//     if (training_id) type = "TRAINING";
//     if (skp_id) type = "SKP";

//     const updatedDocument = await prisma.masterDocument.update({
//       where: { id },
//       data: {
//         url,
//         status,
//         type,
//         training: training_id ? { connect: { id: training_id } } : undefined,
//         skp: skp_id ? { connect: { id: skp_id } } : undefined,
//       },
//     });

//     return response(
//       200,
//       true,
//       "Master Document berhasil diperbarui",
//       updatedDocument
//     );
//   } catch (error) {
//     return response(500, false, "Failed to update Master Document", null, {
//       error: error.message,
//     });
//   }
// }
