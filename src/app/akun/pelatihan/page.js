"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, FileText, Award, FileSignature, Scan } from "lucide-react";
import Link from "next/link";

// Data contoh untuk tabel
const dummyData = [
  {
    id: 1,
    pelatihan: "Ahli K3 Umum ",
    tanggal: "28 FEB 2025",
  },
  {
    id: 2,
    pelatihan: "Tenaga Kerja Tingkat Tinggi (TKBT) ",
    tanggal: "10 MAR 2025",
  },
];

export default function PelatihanPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="ml-64 p-6 min-h-screen">
      {/* Card Utama (Header + Search + Tabel) */}
      <Card className="p-6 bg-white shadow-md rounded-lg">
        {/* Header + Search */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Pelatihan</h1>
          <Input
            className="w-1/3 px-4 py-2 border rounded-md"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="px-4 py-2">NO</th>
                <th className="px-4 py-2">PELATIHAN</th>
                <th className="px-4 py-2">TANGGAL</th>
                <th className="px-4 py-2">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">{String(index + 1).padStart(2, "0")}</td>
                  <td className="px-4 py-2">{item.pelatihan}</td>
                  <td className="px-4 py-2">{item.tanggal}</td>
                  <td className="px-4 py-2 flex gap-2">
                    
                    {/* Button Data Diri */}
                    <div className="relative group">
                      <Link href="/akun/pelatihan/datadiri">
                        <Button className="p-2 bg-blue-950 hover:bg-blue-800 rounded-md">
                          <User size={20} />
                        </Button>
                      </Link>
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-[#363636] rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Data Diri
                      </span>
                    </div>

                    {/* Button Dokumen */}
                    <div className="relative group">
                     
                      <Link href="/akun/pelatihan/dokumen">
                        <Button className="p-2 bg-blue-950 hover:bg-blue-800 rounded-md">
                          <FileText size={20} />
                        </Button>
                      </Link>
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-[#363636] rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        Dokumen
                      </span>
                    </div>  

                    {/* Button E-Sertifikat */}
                    <div className="relative group">
                      <Button className="p-2 bg-blue-950 hover:bg-blue-800 rounded-md">
                        <Award size={20} />
                      </Button>
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-[#363636] rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        E-Sertifikat
                      </span>
                    </div>

                    {/* Button SKL */}
                    <div className="relative group">
                      <Button className="p-2 bg-blue-950 hover:bg-blue-800 rounded-md">
                        <FileSignature size={20} />
                      </Button>
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-[#363636] rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        SKL
                      </span>
                    </div>

                    {/* Button Scan Sertifikat */}
                    <div className="relative group">
                      <Button className="p-2 bg-blue-950 hover:bg-blue-800 rounded-md">
                        <Scan size={20} />
                      </Button>
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-[#363636] rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        Scan Sertifikat
                      </span>
                    </div>

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
