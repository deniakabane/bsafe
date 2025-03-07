"use client";

import { FileText } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

export default function LegalAdministrasi() {
  const fileDescriptions = [
    { key: "pasfoto", label: "Pasphoto Latar Belakang Merah", required: true },
    { key: "ktp", label: "KTP", required: true },
    { key: "ijazah", label: "Ijazah Pendidikan Terakhir Minimal D3", required: true },
    { key: "CV", label: "CV/Riwayat Hidup", required: true },
    { key: "scan fakta", label: "Fakta Integritas", required: true },
    { key: "scan surat tugas", label: "Surat Surat Tugas", required: true },
    { key: "scan sertifikat", label: "Sertifikat, SKP, Lisensi", required: false },

  ];

  return (
    <div className="ml-64 p-6 min-h-screen flex justify-center items-center">
      {/* Card Container */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        {/* Judul */}
        <div className="text-start font-semibold text-2xl mb-6 text-blue-950">
          Ahli K3 Umum Online
        </div>

        {/* Grid Dokumen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {fileDescriptions.map((file) => (
            <div
              key={file.key}
              className="border px-4 pt-4 pb-4 rounded-md border-gray-300 flex flex-col gap-2"
            >
              {/* Label File */}
              <div className="flex items-center text-sm font-medium mb-3">
                <FileText className="size-6 mr-2 w-[8%]" />
                <div className="flex justify-between w-11/12 items-center">
                  <div>{file.label}</div>
                  {file.required && (
                    <div className="text-xs font-medium text-red-500">*Wajib</div>
                  )}
                </div>
              </div>

              {/* Upload Button (Dummy) */}
              <div className="border-dashed border-2 border-gray-400 p-4 text-center rounded-md cursor-pointer hover:bg-gray-100">
                <span className="text-blue-600 font-medium">Upload {file.label}</span>
                <div className="text-xs text-gray-500">JPEG, PNG, JPG...</div>
              </div>

              {/* Lihat File Button (Dummy) */}
              <button
                type="button"
                className="py-2 px-4 mt-2 text-sm font-medium rounded-lg bg-blue-900 text-white hover:bg-blue-700"
              >
                Lihat File
              </button>

              {/* Keterangan Upload Ulang */}
              <div className="text-xs text-gray-600">
                Jika ingin mengupload ulang, klik Upload lagi di atas.
              </div>
            </div>
          ))}

        </div>
        <div className="flex justify-end mt-6">
          <Button className="bg-gray-500 hover:bg-gray-700 text-white px-6 py-2 rounded-md mr-2">
            Batal
          </Button>
          <Button className="bg-blue-950 hover:bg-blue-800 text-white px-6 py-2 rounded-md">
            Simpan
          </Button>
        </div>
      </div>
     
    </div>
    
  );
}
