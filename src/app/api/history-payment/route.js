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

    const whereCondition = search
      ? buildSearchCondition("user_id", search)
      : {};

    const [historyPayments, totalItems] = await Promise.all([
      prisma.historyPayment.findMany({
        where: whereCondition,
        include: {
          skp: {
            select: {
              id: true,
              name: true,
            },
          },
          training: {
            select: {
              id: true,
              name: true,
            },
          },
          reseller: {
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
      prisma.historyPayment.count({
        where: whereCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);

    return response(
      200,
      true,
      "Data History Payment berhasil diambil",
      historyPayments,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve History Payment data", {
      error: error.message,
    });
  }
}

export async function POST(req) {
  try {
    const jsonData = await req.json();
    const {
      user_id,
      training_id,
      skp_id,
      nominal,
      proof_of_tf,
      reseller_id,
      status,
    } = jsonData;

    if (!user_id || !nominal || !status || (!training_id && !skp_id)) {
      return response(
        400,
        false,
        "User ID, Nominal, Status, dan salah satu dari Training ID atau SKP ID wajib diisi"
      );
    }

    if (training_id && skp_id) {
      return response(
        400,
        false,
        "Training ID dan SKP ID tidak boleh diisi bersamaan"
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id: user_id },
    });
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
      const skpExists = await prisma.skp.findUnique({
        where: { id: skp_id },
      });
      if (!skpExists) {
        return response(400, false, "SKP not found");
      }
    }

    if (reseller_id) {
      const resellerExists = await prisma.reseller.findUnique({
        where: { id: reseller_id },
      });
      if (!resellerExists) {
        return response(400, false, "Reseller not found");
      }
    }

    const newHistoryPayment = await prisma.historyPayment.create({
      data: {
        user: { connect: { id: user_id } }, // Menghubungkan dengan user
        training: training_id ? { connect: { id: training_id } } : undefined,
        skp: skp_id ? { connect: { id: skp_id } } : undefined,
        reseller: reseller_id ? { connect: { id: reseller_id } } : undefined,
        nominal,
        proof_of_tf,
        status,
      },
    });

    return response(
      201,
      true,
      "History Payment berhasil dibuat",
      newHistoryPayment
    );
  } catch (error) {
    return response(500, false, "Failed to create History Payment", null, {
      error: error.message,
    });
  }
}
