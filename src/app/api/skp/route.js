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
    const searchCondition = buildSearchCondition("name", search);

    const [skps, totalItems] = await Promise.all([
      prisma.skp.findMany({
        where: searchCondition,
        select: {
          id: true,
          name: true,
          start_date: true,
          end_date: true,
          price: true,
          image_id: true,
          status: true,
          schema_id: true,
          updated_at: true,
          schema: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.skp.count({
        where: searchCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);
    return response(200, true, "Data skp berhasil diambil", skps, pagination);
  } catch (error) {
    return response(500, false, "Failed to retrieve skps", {
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
      "image_id",
      "status",
      "end_date",
      "type",
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

    // Validasi ENUM untuk type
    const validTypes = ["SKP", "LISENSI"];
    const type = formData.type.toUpperCase(); // Biar fleksibel inputnya bisa kecil/besar
    if (!validTypes.includes(type)) {
      return response(400, false, "Invalid type. Harus 'SKP' atau 'LISENSI'");
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

    const newskp = await prisma.skp.create({
      data: {
        name: formData.name,
        slug,
        description: formData.description,
        start_date: startDate,
        end_date: endDate,
        status: formData.status,
        image_id: parseInt(formData.image_id, 10),
        type, // Sudah dipastikan hanya "SKP" atau "LISENSI"
        price: parseFloat(formData.price),
        schema_id: parseInt(formData.schema_id, 10),
      },
    });

    return response(201, true, "SKP successfully created", newskp);
  } catch (error) {
    return response(500, false, "Failed to create SKP", null, {
      error: error.message,
    });
  }
}
