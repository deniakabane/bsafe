import { PrismaClient } from "@prisma/client";
import response from "@/utils/response";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const { user_training_id, userData, trainingDetailData } = await req.json();

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

    // Update data User tanpa validasi untuk field lain, email tetap dari database
    await prisma.user.update({
      where: { id: userTraining.user_id },
      data: {
        name: userData.name,
        phone: userData.phone,
        email: userTraining.user.email, // Email tidak bisa diubah
        // password: userData.password || undefined,
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

    // Update atau buat UserTrainingDetail jika ada perubahan
    const existingTrainingDetail = await prisma.userTrainingDetail.findUnique({
      where: { user_training_id },
    });

    if (trainingDetailData) {
      if (existingTrainingDetail) {
        await prisma.userTrainingDetail.update({
          where: { user_training_id },
          data: {
            company_name: trainingDetailData.company_name || undefined,
            company_address: trainingDetailData.company_address || undefined,
            institution: trainingDetailData.institution || undefined,
          },
        });
      } else {
        await prisma.userTrainingDetail.create({
          data: {
            user_training_id,
            company_name: trainingDetailData.company_name || undefined,
            company_address: trainingDetailData.company_address || undefined,
            institution: trainingDetailData.institution || undefined,
          },
        });
      }
    }

    return response(200, true, "Data user dan training berhasil diperbarui");
  } catch (error) {
    console.error("🔥 Error updating user & training detail:", error);
    return response(500, false, "Terjadi kesalahan saat memperbarui data", {
      error: error.message,
    });
  }
}
