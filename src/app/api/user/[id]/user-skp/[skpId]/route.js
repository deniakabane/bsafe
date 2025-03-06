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
    const userId = parseInt(params.id, 10);
    const skpId = parseInt(params.skpId, 10); // Ubah dari trainingId ke skpId

    if (isNaN(userId) || isNaN(skpId)) {
      return response(400, false, "Invalid user ID or skp ID");
    }

    const jsonData = await req.json();
    const { certificate_no, theme } = jsonData;

    if (!certificate_no || !theme) {
      return response(400, false, "Missing required fields");
    }

    const existingUserSkp = await prisma.userSkp.findFirst({
      where: {
        user_id: userId,
        skp_id: skpId,
      },
    });

    if (!existingUserSkp) {
      return response(404, false, "User skp record not found");
    }

    const certificateExists = await prisma.userSkp.findFirst({
      where: {
        certificate_no,
        NOT: { id: existingUserSkp.id },
      },
    });

    if (certificateExists) {
      return response(400, false, "Certificate number already exists");
    }

    const updatedUserSkp = await prisma.userSkp.update({
      where: { id: existingUserSkp.id },
      data: {
        certificate_no,
        theme,
      },
    });

    return response(200, true, "User skp successfully updated", updatedUserSkp);
  } catch (error) {
    return response(500, false, "Failed to update user skp", null, {
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
    const userId = parseInt(params.id, 10);
    const skpId = parseInt(params.skpId, 10); // Ubah dari trainingId ke skpId

    if (isNaN(userId) || isNaN(skpId)) {
      return response(400, false, "Invalid user ID or skp ID");
    }

    const existingUserSkp = await prisma.userSkp.findFirst({
      where: {
        user_id: userId,
        skp_id: skpId,
      },
    });

    if (!existingUserSkp) {
      return response(404, false, "User skp record not found");
    }

    await prisma.userSkp.delete({
      where: { id: existingUserSkp.id },
    });

    return response(200, true, "User skp successfully deleted");
  } catch (error) {
    return response(500, false, "Failed to delete user skp", null, {
      error: error.message,
    });
  }
}
