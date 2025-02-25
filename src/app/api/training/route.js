import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";
import { validateNationalId } from "@/utils/validateNationalId";
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
    const searchCondition = buildSearchCondition("name", search);

    const [trainings, totalItems] = await Promise.all([
      prisma.training.findMany({
        where: searchCondition,
        select: {
          id: true,
          name: true,
          description: true,
          start_date: true,
          end_date: true,
          price: true,
          schema_id: true,
        },
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.training.count({
        where: searchCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);
    return response(
      200,
      true,
      "Data training berhasil diambil",
      trainings,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve trainings", {
      error: error.message,
    });
  }
}

export async function POST(req) {
  try {
    const formData = await req.json();

    const requiredFields = [
      "name",
      "description",
      "start_date",
      "end_date",
      "price",
      "schema_id",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length) {
      return response(
        400,
        false,
        `Missing fields: ${missingFields.join(", ")}`
      );
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (startDate > endDate) {
      return response(400, false, "Start date cannot be later than end date");
    }

    const schemaExists = await prisma.schema.findUnique({
      where: { id: parseInt(formData.schema_id, 10) },
    });

    if (!schemaExists) {
      return response(400, false, "Invalid schema_id: Schema not found");
    }

    const slug = formData.name.replace(/\s+/g, "-").toLowerCase();

    const newTraining = await prisma.training.create({
      data: {
        name: formData.name,
        slug,
        description: formData.description,
        start_date: startDate,
        end_date: endDate,
        price: formData.price, // Pastikan harga dikonversi ke number
        schema_id: formData.schema_id, // Pastikan schema_id dikonversi ke number
      },
    });

    return response(201, true, "Training successfully created", newTraining);
  } catch (error) {
    return response(500, false, "Failed to create training", null, {
      error: error.message,
    });
  }
}
