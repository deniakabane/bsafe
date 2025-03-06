import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";
const prisma = new PrismaClient();
import { checkSession } from "@/utils/session";
export async function GET(req, { params }) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const appealId = parseInt(params.id, 10);
    if (isNaN(appealId)) return response(400, false, "Invalid appeal ID");

    const {
      page,
      limit,
      offset,
      search,
      sortField = "created_at",
      sortOrder = "desc",
    } = getQueryParams(req.url);

    const whereCondition = {
      appeal_id: appealId,
      ...(search ? buildSearchCondition("training_id", search) : {}),
    };

    const [productAppealTrainings, totalItems] = await Promise.all([
      prisma.productAppealTraining.findMany({
        where: whereCondition,
        include: {
          training: {
            select: {
              id: true,
              name: true,
            },
          },
          appeal: {
            select: {
              id: true,
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
      prisma.productAppealTraining.count({
        where: whereCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);

    return response(
      200,
      true,
      "Data Product Appeal Training berhasil diambil",
      productAppealTrainings,
      pagination
    );
  } catch (error) {
    return response(
      500,
      false,
      "Failed to retrieve Product Appeal Training data",
      {
        error: error.message,
      }
    );
  }
}

export async function POST(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const params = await context.params;
    const appealId = parseInt(params.id, 10);
    if (isNaN(appealId)) return response(400, false, "Invalid appeal ID");

    const jsonData = await req.json();
    const { training_id, type = "TRAINING", status = true } = jsonData;

    if (!training_id) {
      return response(400, false, "Training ID is required");
    }

    const trainingId = Number(training_id);

    const trainingExists = await prisma.training.findUnique({
      where: { id: trainingId },
    });

    if (!trainingExists) {
      return response(400, false, "Training not found");
    }

    const appealExists = await prisma.productAppeal.findUnique({
      where: { id: appealId },
    });

    if (!appealExists) {
      return response(400, false, "Appeal not found");
    }

    const productAppealTrainingExists =
      await prisma.productAppealTraining.findFirst({
        where: {
          training_id: trainingId,
          appeal_id: appealId,
        },
      });

    if (productAppealTrainingExists) {
      return response(
        400,
        false,
        "Training is already associated with this appeal"
      );
    }

    const newProductAppealTraining = await prisma.productAppealTraining.create({
      data: {
        training_id: trainingId,
        appeal_id: appealId,
        type,
        status,
      },
    });

    return response(
      201,
      true,
      "Product Appeal Training successfully created",
      newProductAppealTraining
    );
  } catch (error) {
    return response(
      500,
      false,
      "Failed to create Product Appeal Training",
      null,
      {
        error: error.message,
      }
    );
  }
}
