"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegistrasiPelatihan() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Logo */}
      <div className="mb-6">
        <Image src="/bsafe-logo.png" alt="B-Safe Logo" width={75} height={75} />
      </div>

      {/* Card Form */}
      <Card className="w-full max-w-lg p-8 bg-white shadow-xl rounded-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Registrasi Pelatihan B-Safe 2025</h1>
          <h3 className="text-gray-600 text-sm mt-1">Think Safe, Act Safe, Be Safe</h3>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Nama Peserta */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">Nama Peserta</Label>
            <Input placeholder="Nama Lengkap" className="text-sm" />
          </div>

          {/* No WhatsApp */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">No WhatsApp</Label>
            <Input placeholder="Nomor WhatsApp" className="text-sm" />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">Email</Label>
            <Input type="email" placeholder="Email" className="text-sm" />
          </div>

          {/* Kode Referral */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">Referensi</Label>
            <Input placeholder="Nama Referensi (opsional)" className="text-sm" />
          </div>

          {/* Pilih Pelatihan */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">Pilih Pelatihan</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih pelatihan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="migas">PENGAWAS K3 MIGAS BNSP ONLINE (5-7 Februari 2024)</SelectItem>
                <SelectItem value="listrik">PETUGAS K3 LISTRIK BNSP (10-12 Maret 2024)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-red-500 mt-1">
              *Pastikan dan cek kembali nama pelatihan dan tanggal pelatihan yang Anda ikuti
            </p>
          </div>

          {/* Bundling Pelatihan */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">Bundling Pelatihan</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih bundling pelatihan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ahlik3">AHLI K3 UMUM BNSP OFFLINE JAKARTA (13-16 Februari 2024)</SelectItem>
                <SelectItem value="inspektur">INSPEKTUR K3 BNSP ONLINE (20-22 Maret 2024)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          

          {/* Button Daftar */}
          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium">
              Daftar Pelatihan
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
