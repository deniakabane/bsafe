"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react"; 

export default function ProfilePage() {

    const [statusPendaftaran, setStatusPendaftaran] = useState("Personal");

  // Data untuk dropdown
  const provinsiOptions = ["Jawa Barat", "Jawa Tengah", "Jawa Timur"];
  const kotaKabOptions = ["Bandung", "Bogor", "Bekasi", "Depok", "Cirebon"];
  const golonganDarahOptions = ["A", "B", "AB", "O"];
  const wilayahWaktuOptions = ["WIB", "WITA", "WIT"];
  const pendidikanOptions = ["SMA", "D3", "S1", "S2", "S3"];
  const jenisKelaminOptions = ["Laki-Laki", "Perempuan"];
  const statusPendaftaranOptions = ["Personal", "Perusahaan"];

  return (
    <div className="ml-64 p-6 min-h-screen relative">
      <Link
        href="/akun/pelatihan"
        className="absolute left-4 top-4 inline-flex items-center gap-x-2 text-sm text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="font-medium">Kembali</span>
      </Link>

      <Card className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-5xl mx-auto mt-12">
        <h1 className="text-xl font-bold text-blue-950 mb-6 border-b pb-3">
          Ahli K3 Umum Online 12 - 20 Maret 2025
        </h1>

        {/* Form Data Diri */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">Data Diri</h2>
        <div className="grid grid-cols-2 gap-6">
          <InputField label="Nama Lengkap" placeholder="Nama Anda" />
          <InputField label="Email *wajib gmail" placeholder="email@gmail.com" />
          <InputField label="No Handphone" placeholder="0898xxxxxxx" />
          <InputField label="NIK KTP" placeholder="123929xxx" />
          <InputField label="Tempat Lahir" placeholder="Bogor" />
          <InputField label="Tanggal Lahir" type="date" />
          <InputField label="Alamat" placeholder="Jl. Bogor" />
          <DropdownField label="Provinsi" options={provinsiOptions} />
          <DropdownField label="Kota/Kab" options={kotaKabOptions} />
          <DropdownField label="Wilayah Waktu" options={wilayahWaktuOptions} />
          <DropdownField label="Golongan Darah" options={golonganDarahOptions} />
          <DropdownField label="Jenis Kelamin" options={jenisKelaminOptions} />
          <DropdownField label="Pendidikan Terakhir" options={pendidikanOptions} />
          <InputField label="Nama Universitas/Sekolah" placeholder="Nama Universitas" />
          <InputField label="Nomor Ijazah" placeholder="123929xxx" />
         
        </div>

        {/* Form Perusahaan */}
        <h1 className="text-xl font-bold text-blue-950 mb-1 border-t pb-4 mt-8 py-4">
          Perusahaan
        </h1>
        <div className="grid grid-cols-2 gap-6">
          {/* Dropdown Status Pendaftaran */}
          <DropdownField
            label="Status Pendaftaran"
            options={statusPendaftaranOptions}
            onChange={(value) => setStatusPendaftaran(value)}
          />

          {/* Input Perusahaan, hanya muncul jika status pendaftaran = "Perusahaan" */}
          {statusPendaftaran === "Perusahaan" && (
            <>
              <InputField label="Nama Perusahaan" placeholder="Nama Perusahaan" />
              <InputField label="Alamat Perusahaan" placeholder="Alamat Perusahaan" />
            </>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end mt-6">
          <Button className="bg-gray-500 hover:bg-gray-700 text-white px-6 py-2 rounded-md mr-2">
            Batal
          </Button>
          <Button className="bg-blue-950 hover:bg-blue-800 text-white px-6 py-2 rounded-md">
            Simpan
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Komponen InputField
const InputField = ({ label, placeholder, type = "text" }) => (
    <div className="flex flex-col">
      <Label className="text-gray-900 font-medium mb-1">{label}</Label>
      <Input
        type={type}
        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
  
  // Komponen DropdownField dengan onChange
  const DropdownField = ({ label, options, onChange }) => (
    <div className="flex flex-col">
      <Label className="text-gray-900 font-medium mb-1">{label}</Label>
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <SelectValue placeholder="Pilih" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );