import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";
import { checkSession } from "@/utils/session";

const prisma = new PrismaClient();

export async function PUT(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return response(400, false, "ID company harus berupa angka");

    const jsonData = await req.json();
    const { name, email, phone, address } = jsonData;

    if (!name || !email || !phone || !address) {
      return response(400, false, "Semua field wajib diisi");
    }

    const existingCompany = await prisma.company.findFirst({
      where: {
        OR: [{ name }, { email }, { phone }],
        NOT: { id },
      },
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

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: jsonData,
    });

    return response(200, true, "Company berhasil diperbarui", updatedCompany);
  } catch (error) {
    return response(500, false, "Failed to update company", null, {
      error: error.message,
    });
  }
}

export async function DELETE(req, context) {
  try {
    const sessionResponse = await checkSession(req);

    if (sessionResponse.status === 401) {
      return sessionResponse;
    }
    const params = await context.params;
    const companyId = parseInt(params.id, 10);
    if (!companyId) return response(400, false, "ID schema harus diisi");

    await prisma.company.delete({ where: { id: companyId } });

    return response(200, true, "Schema berhasil dihapus");
  } catch (error) {
    return response(500, false, "Failed to delete schema", null, {
      error: error.message,
    });
  }
}

export async function GET(req, context) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return response(400, false, "ID company harus berupa angka");

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) return response(404, false, "Company tidak ditemukan");

    return response(200, true, "Data company berhasil diambil", company);
  } catch (error) {
    return response(500, false, "Failed to retrieve company", null, {
      error: error.message,
    });
  }
}
