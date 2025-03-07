"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Data contoh untuk tabel modul
const modulData = [
  { kategori: "Kemnaker RI", modul: 10, link: "/akun/modul/kemnaker" },
  { kategori: "BNSP RI", modul: 6, link: "/akun/modul/bnsp" },
  { kategori: "Umum", modul: 3, link: "/akun/modul/umum" },
];

export default function ModulPage() {
  return (
    <div className="ml-64 p-6 min-h-screen">
      {/* Card utama */}
      <Card className="p-6 bg-white shadow-md rounded-lg">
        {/* Judul */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Modul</h1>

        {/* Tabel Modul */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-left bg-gray-100">
                <th className="px-4 py-2 border-b border-gray-300">Kategori</th>
                <th className="px-4 py-2 border-b border-gray-300">Modul</th>
                <th className="px-4 py-2 border-b border-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {modulData.map((item, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="px-4 py-2 font-medium">{item.kategori}</td>
                  <td className="px-4 py-2 font-medium">{item.modul}</td>
                  <td className="px-4 py-2">
                    <Link href={item.link}>
                      <Button className="px-4 py-1 bg-white border border-gray-400 text-black rounded-md shadow-sm hover:bg-gray-100">
                        Lihat Modul
                      </Button>
                    </Link>
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
