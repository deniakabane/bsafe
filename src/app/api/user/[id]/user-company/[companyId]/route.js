import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import { validateNationalId } from "@/utils/validateNationalId";
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
    const companyId = parseInt(params.companyId, 10);

    if (isNaN(userId) || isNaN(companyId)) {
      return response(400, false, "Invalid user ID or company ID");
    }

    const jsonData = await req.json();
    const { still_working } = jsonData;

    if (typeof still_working !== "boolean") {
      return response(400, false, "Missing or invalid 'still_working' field");
    }

    const existingUserCompany = await prisma.userCompany.findFirst({
      where: {
        user_id: userId,
        company_id: companyId,
      },
    });

    if (!existingUserCompany) {
      return response(404, false, "User company record not found");
    }

    const updatedUserCompany = await prisma.userCompany.update({
      where: { id: existingUserCompany.id },
      data: { still_working },
    });

    return response(
      200,
      true,
      "User company successfully updated",
      updatedUserCompany
    );
  } catch (error) {
    return response(500, false, "Failed to update user company", null, {
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
