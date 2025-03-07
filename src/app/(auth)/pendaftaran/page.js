"use client";

import { useState } from "react";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function RegistrasiPelatihan() {
  const { data, error } = useSWR("/api/public/training", fetcher);
  const [category, setCategory] = useState("");

  const filteredData = category ? data?.filter((item) => item.category === category) : data;

  const columns = [
    { accessorKey: "name", header: "Nama Pelatihan" },
    { accessorKey: "start_date", header: "Tanggal Mulai" },
    { accessorKey: "end_date", header: "Tanggal Selesai" },
    { accessorKey: "price", header: "Harga" },
  ];

  const table = useReactTable({
    data: filteredData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-10">
      <Card className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-4xl">
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/bsafelogo.png" alt="Logo" width={100} height={100} />
          <h1 className="text-2xl font-bold mt-4 text-gray-800 text-center">Think Safe, Act Safe, Be Safe</h1>
        </div>

        {/* Form Registrasi */}
        <h2 className="text-2xl font-bold mb-6 text-blue-950">Pendaftaran</h2>
        <div className="space-y-6">
          <div>
            <Label className="text-lg">Nama Peserta</Label>
            <Input className="text-lg p-3" placeholder="Nama Lengkap" />
          </div>
          <div>
            <Label className="text-lg">Email</Label>
            <Input className="text-lg p-3" type="email" placeholder="Email" />
            <p className="text-sm text-red-500 mt-1">*Pastikan menggunakan email Gmail yang aktif untuk keperluan halaman member anda</p>
          </div>
          <div>
            <Label className="text-lg">No Telepon</Label>
            <Input className="text-lg p-3" placeholder="No Telepon" />
          </div>
          <div>
            <Label className="text-lg">Referensi</Label>
            <Select>
              <SelectTrigger className="text-lg p-3">
                <SelectValue placeholder="Pilih Referensi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="alumni_bsafe">Alumni Bsafe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pilih Pelatihan & Tabel */}
        <h2 className="text-2xl font-bold mt-8 mb-6 text-blue-950">Pilih Pelatihan</h2>
        <div className="space-y-6">
          <div>
            <Label className="text-lg">Kategori</Label>
            <Select onValueChange={setCategory}>
              <SelectTrigger className="text-lg p-3">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pelatihan">Pelatihan</SelectItem>
                <SelectItem value="bundling">Bundling Pelatihan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

{console.log(data)}

        {/* Tabel */}
        {error ? (
          <p className="text-red-500 text-lg">Gagal memuat data.</p>
        ) : !data ? (
          <p className="text-lg">Loading...</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">Detail Pelatihan</h3>
            <table className="w-full border border-gray-300 text-lg">
              <thead className="bg-gray-200 text-gray-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="border p-4 text-left">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border hover:bg-gray-100">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="border p-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Note & Button */}
        <p className="text-sm text-gray-600 mt-6">*Cek kembali dan pastikan pelatihan yang sudah anda pilih! Dengan mendaftar, anda menyetujui tim Bsafe akan menghubungi anda, kerjakan sekarang.</p>
        <div className="flex justify-end mt-4">
          <Button className="text-lg p-3 bg-blue-600 hover:bg-blue-700 text-white">Daftar Pelatihan</Button>
        </div>
      </Card>
    </div>
  );
}
