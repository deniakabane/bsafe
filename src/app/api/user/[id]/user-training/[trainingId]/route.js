import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import { validateNationalId } from "@/utils/validateNationalId";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    const userId = parseInt(params.id, 10);
    const trainingId = parseInt(params.trainingId, 10);

    if (isNaN(userId) || isNaN(trainingId)) {
      return response(400, false, "Invalid user ID or training ID");
    }

    const jsonData = await req.json();
    const { certificate_no, theme } = jsonData;

    if (!certificate_no || !theme) {
      return response(400, false, "Missing required fields");
    }

    const existingUserTraining = await prisma.userTraining.findFirst({
      where: {
        user_id: userId,
        training_id: trainingId,
      },
    });

    if (!existingUserTraining) {
      return response(404, false, "User training record not found");
    }

    const certificateExists = await prisma.userTraining.findFirst({
      where: {
        certificate_no,
        NOT: { id: existingUserTraining.id },
      },
    });

    if (certificateExists) {
      return response(400, false, "Certificate number already exists");
    }

    const updatedUserTraining = await prisma.userTraining.update({
      where: { id: existingUserTraining.id },
      data: {
        certificate_no,
        theme,
      },
    });

    return response(
      200,
      true,
      "User training successfully updated",
      updatedUserTraining
    );
  } catch (error) {
    return response(500, false, "Failed to update user training", null, {
      error: error.message,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const userId = parseInt(params.id, 10);
    const trainingId = parseInt(params.trainingId, 10);

    if (isNaN(userId) || isNaN(trainingId)) {
      return response(400, false, "Invalid user ID or training ID");
    }

    const existingUserTraining = await prisma.userTraining.findFirst({
      where: {
        user_id: userId,
        training_id: trainingId,
      },
    });

    if (!existingUserTraining) {
      return response(404, false, "User training record not found");
    }

    await prisma.userTraining.delete({
      where: { id: existingUserTraining.id },
    });

    return response(200, true, "User training successfully deleted");
  } catch (error) {
    return response(500, false, "Failed to delete user training", null, {
      error: error.message,
    });
  }
}
