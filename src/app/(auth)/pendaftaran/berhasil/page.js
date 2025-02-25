"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-2xl p-10 bg-white shadow-lg rounded-lg border border-gray-300">
        <div className="flex justify-center mb-4">
          <Image src="/bsafe-logo.png" alt="B-Safe Logo" width={100} height={100} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center">Berhasil Mendaftar Pelatihan di B-Safe</h1>
        <h3 className="text-gray-600 text-sm text-center mt-1">Think Safe, Act Safe, Be Safe</h3>
        <div className="mt-6 space-y-6 border border-gray-300 p-6 rounded-md bg-gray-50">
        
          <div>
            <p className="text-sm font-medium text-gray-500">Peserta</p>
            <p className="text-lg font-semibold text-gray-900">Nanda Jati Sampurna</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">No WhatsApp</p>
            <p className="text-lg font-semibold text-gray-900">082912928192</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Pelatihan</p>
            <p className="text-lg font-semibold text-gray-900">AHLI K3 UMUM KEMNAKER RI ONLINE</p>
            <p className="text-gray-700">(12-24 Februari 2024)</p>
          </div>
        </div>

        <p className="text-gray-700 text-sm text-center mt-6">
          Jika perlu bantuan, silakan hubungi admin kami
        </p>

        <div className="flex justify-center mt-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium">
            Chat Admin
          </Button>
        </div>
      </Card>
    </div>
  );
}
