import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import {
  getQueryParams,
  buildSearchCondition,
  getPaginationMeta,
} from "@/utils/queryHelper";
import { checkSession } from "@/utils/session";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const sessionResponse = await checkSession(req);

    if (!sessionResponse.success) {
      return sessionResponse;
    }
    const { page, limit, offset, search, sortField, sortOrder } =
      getQueryParams(req.url);
    const searchCondition = buildSearchCondition("name", search);

    const [companies, totalItems] = await Promise.all([
      prisma.company.findMany({
        where: searchCondition,
        select: {
          id: true,
          logo: true,
          name: true,
          city: true,
          province: true,
          phone: true,
        },
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: offset,
        take: limit,
      }),
      prisma.company.count({
        where: searchCondition,
      }),
    ]);

    const pagination = getPaginationMeta(totalItems, limit, page);

    return response(
      200,
      true,
      "Data company berhasil diambil",
      companies,
      pagination
    );
  } catch (error) {
    return response(500, false, "Failed to retrieve companies", {
      error: error.message,
    });
  }
}

export async function POST(req) {
  try {
    const sessionResponse = await checkSession(req);

    if (!sessionResponse.success) {
      return sessionResponse;
    }
    const jsonData = await req.json();
    const { name, email, phone, address } = jsonData;

    if (!name || !email || !phone || !address) {
      return response(400, false, "Nama, email, phone, dan alamat harus diisi");
    }

    const existingCompany = await prisma.company.findFirst({
      where: { OR: [{ name }, { email }, { phone }] },
      select: { name: true, email: true, phone: true },
    });

    if (existingCompany) {
      let conflictField =
        existingCompany.name === name
          ? "Nama"
          : existingCompany.email === email
          ? "Email"
          : "Phone";
      return response(400, false, `${conflictField} sudah digunakan`);
    }

    const newCompany = await prisma.company.create({ data: jsonData });

    return response(201, true, "Company berhasil dibuat", newCompany);
  } catch (error) {
    return response(500, false, "Failed to create company", null, {
      error: error.message,
    });
  }
}
