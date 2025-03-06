import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";
import { checkSession } from "@/utils/session";

const prisma = new PrismaClient();

export async function GET(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const {
      page,
      limit,
      offset,
      search,
      sortField = "created_at",
      sortOrder = "desc",
    } = getQueryParams(req.url);

    const params = await context.params;
    const { id } = params;

    if (!id) {
      return response(400, false, "User ID is required");
    }

    const searchCondition = buildSearchCondition("skp_id", search);

    const whereCondition = {
      ...searchCondition,
      user_id: parseInt(id, 10),
    };

    const [userSkps, totalItems] = await Promise.all([
      prisma.userSkp.findMany({
        where: whereCondition,
        select: {
          id: true,
          user_id: true,
          skp_id: true,
          certificate_no: true,
          theme: true,
          updated_at: true,
          skp: {
            select: {
              name: true,
              slug: true,
              type: true, // Tambahkan type di response
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.userSkp.count({
        where: whereCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);

    return response(
      200,
      true,
      "Data user skp berhasil diambil",
      userSkps,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve user skp data", {
      error: error.message,
    });
  }
}

export async function POST(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const params = await context.params;
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) return response(400, false, "Invalid user ID");

    const jsonData = await req.json();
    const { skp_id, certificate_no, theme } = jsonData;

    if (!skp_id || !certificate_no || !theme) {
      return response(400, false, "Missing required fields");
    }

    const skpId = Number(skp_id);

    // Cek apakah user_id valid
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      return response(400, false, "User not found");
    }

    // Cek apakah skp_id valid
    const skpExists = await prisma.skp.findUnique({
      where: { id: skpId },
      select: { id: true, type: true },
    });

    if (!skpExists) {
      return response(400, false, "Skp not found");
    }

    // Cek apakah kombinasi user_id dan skp_id sudah ada
    const userSkpExists = await prisma.userSkp.findFirst({
      where: {
        user_id: userId,
        skp_id: skpId,
      },
    });

    if (userSkpExists) {
      return response(400, false, "User is already enrolled in this skp");
    }

    // Cek apakah nomor sertifikat sudah digunakan
    const certificateExists = await prisma.userSkp.findFirst({
      where: { certificate_no },
    });

    if (certificateExists) {
      return response(400, false, "Certificate number already exists");
    }

    // Buat data baru tanpa `type`
    const newUserSkp = await prisma.userSkp.create({
      data: {
        user_id: userId,
        skp_id: skpId,
        certificate_no,
        theme,
      },
    });

    return response(201, true, "User skp successfully created", {
      ...newUserSkp,
      type: skpExists.type,
    });
  } catch (error) {
    return response(500, false, "Failed to create user skp", null, {
      error: error.message,
    });
  }
}
