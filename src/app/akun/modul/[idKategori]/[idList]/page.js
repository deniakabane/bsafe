"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// Data contoh untuk tabel modul
const modulData = [
  { kategori: "Manajemen Resiko", modul: 100, pdfUrl: "/pdf/manajemen-resiko.pdf" },
  { kategori: "Buku Saku K3", modul: 60, pdfUrl: "/pdf/buku-saku-k3.pdf" },
  { kategori: "Pengawasan Kesehatan kerja", modul: 30, pdfUrl: "/pdf/pengawasan-kesehatan.pdf" },
];

export default function ModulPage() {
  const [selectedPdf, setSelectedPdf] = useState(null);

  return (
    <div className="ml-64 p-6 min-h-screen relative">
      {/* Tombol Kembali */}
      <div className="mb-6">
        <Link
          href="/akun/modul"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="font-medium">Kembali</span>
        </Link>
      </div>

      {/* Card utama */}
      <Card className="p-6 bg-white shadow-md rounded-lg">
        {/* Judul */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Kemnaker RI - Ahli Keselamatan & Kesehatan Kerja Umum</h1>

        {/* Tabel Modul */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-left bg-gray-100">
                <th className="px-4 py-2 border-b border-gray-300">Kategori</th>
                <th className="px-4 py-2 border-b border-gray-300">Halaman</th>
                <th className="px-4 py-2 border-b border-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {modulData.map((item, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="px-4 py-2 font-medium">{item.kategori}</td>
                  <td className="px-4 py-2 font-medium">{item.modul}</td>
                  <td className="px-4 py-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="px-4 py-1 bg-white border border-gray-400 text-black rounded-md shadow-sm hover:bg-gray-100"
                          onClick={() => setSelectedPdf(item.pdfUrl)}
                        >
                          Lihat Detail
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{item.kategori}</DialogTitle>
                        </DialogHeader>
                        <div className="h-[500px]">
                          {selectedPdf && (
                            <iframe src={selectedPdf} className="w-full h-full rounded-md" />
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
