import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_training_id = searchParams.get("user_training_id");

    if (!user_training_id) {
      return response(400, false, "Parameter user_training_id wajib diisi");
    }

    const userTrainingIdInt = parseInt(user_training_id, 10);
    if (isNaN(userTrainingIdInt)) {
      return response(400, false, "user_training_id harus berupa angka");
    }

    // Ambil data UserTraining beserta relasi yang valid
    const userTraining = await prisma.userTraining.findUnique({
      where: { id: userTrainingIdInt },
      include: {
        user: true,
        details: true, // Gunakan nama yang benar dari schema
      },
    });

    if (!userTraining) {
      return response(404, false, "User training tidak ditemukan");
    }

    return response(200, true, "Data user training ditemukan", userTraining);
  } catch (error) {
    console.error("🔥 Error fetching user training data:", error);
    return response(500, false, "Terjadi kesalahan saat mengambil data", {
      error: error.message,
    });
  }
}

export async function PUT(req) {
  try {
    const { user_training_id, userData, trainingData } = await req.json();

    // Validasi hanya untuk name dan phone (email tidak boleh diubah)
    if (!user_training_id || !userData?.name || !userData?.phone) {
      return response(
        400,
        false,
        "user_training_id, name, dan phone wajib diisi"
      );
    }

    // Ambil user_id dan email dari user training
    const userTraining = await prisma.userTraining.findUnique({
      where: { id: user_training_id },
      select: { user_id: true, user: { select: { email: true } } },
    });

    if (!userTraining) {
      return response(404, false, "User training tidak ditemukan");
    }

    // Update data User tanpa mengubah email
    await prisma.user.update({
      where: { id: userTraining.user_id },
      data: {
        name: userData.name,
        phone: userData.phone,
        email: userTraining.user.email, // Email tidak bisa diubah
        national_id_number: userData.national_id_number || undefined,
        gender: userData.gender || undefined,
        blood_type: userData.blood_type || undefined,
        birth_place: userData.birth_place || undefined,
        birth_date: userData.birth_date
          ? new Date(userData.birth_date)
          : undefined,
        religion: userData.religion || undefined,
        domicile_province: userData.domicile_province || undefined,
        domicile_city: userData.domicile_city || undefined,
        last_education: userData.last_education || undefined,
        full_address: userData.full_address || undefined,
        region: userData.region || undefined,
        education_level: userData.education_level || undefined,
        university_name: userData.university_name || undefined,
        diploma_number: userData.diploma_number || undefined,
        referensi: userData.referensi || undefined,
      },
    });

    // Update data UserTraining
    await prisma.userTraining.update({
      where: { id: user_training_id },
      data: {
        company_name: trainingData?.company_name || undefined,
        company_address: trainingData?.company_address || undefined,
        regis_status: trainingData?.regis_status || undefined,
      },
    });

    return response(200, true, "Data user dan training berhasil diperbarui");
  } catch (error) {
    // console.error("🔥 Error updating user & training detail:", error);
    return response(500, false, "Terjadi kesalahan saat memperbarui data", {
      error: error.message,
    });
  }
}
