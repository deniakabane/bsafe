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
    const {
      page,
      limit,
      offset,
      search,
      sortField = "created_at",
      sortOrder = "desc",
    } = getQueryParams(req.url);

    const whereCondition = search ? buildSearchCondition("name", search) : {};

    const [masterDocuments, totalItems] = await Promise.all([
      prisma.masterDocument.findMany({
        where: whereCondition,
        include: {
          training: {
            select: {
              id: true,
              name: true,
            },
          },
          skp: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
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
      prisma.masterDocument.count({
        where: whereCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);

    return response(
      200,
      true,
      "Data Master Document berhasil diambil",
      masterDocuments,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve Master Document data", {
      error: error.message,
    });
  }
}

export async function POST(req) {
  try {
    const jsonData = await req.json();
    const { user_id, name, url, status, training_id, skp_id } = jsonData;

    if (!user_id || !name || !url) {
      return response(400, false, "User ID, Name, dan URL wajib diisi");
    }

    if (training_id && skp_id) {
      return response(
        400,
        false,
        "Training ID dan SKP ID tidak boleh diisi bersamaan"
      );
    }

    const userExists = await prisma.user.findUnique({ where: { id: user_id } });
    if (!userExists) {
      return response(400, false, "User not found");
    }

    if (training_id) {
      const trainingExists = await prisma.training.findUnique({
        where: { id: training_id },
      });
      if (!trainingExists) {
        return response(400, false, "Training not found");
      }
    }

    if (skp_id) {
      const skpExists = await prisma.skp.findUnique({ where: { id: skp_id } });
      if (!skpExists) {
        return response(400, false, "SKP not found");
      }
    }

    let type = "USER";
    if (training_id) type = "TRAINING";
    if (skp_id) type = "SKP";

    const newMasterDocument = await prisma.masterDocument.create({
      data: {
        user: { connect: { id: user_id } },
        name,
        url,
        type,
        status,
        training: training_id ? { connect: { id: training_id } } : undefined,
        skp: skp_id ? { connect: { id: skp_id } } : undefined,
      },
    });

    return response(
      201,
      true,
      "Master Document berhasil dibuat",
      newMasterDocument
    );
  } catch (error) {
    return response(500, false, "Failed to create Master Document", null, {
      error: error.message,
    });
  }
}
