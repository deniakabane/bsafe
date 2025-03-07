"use client"; 

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-urbanist">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6 py-4">
          <img src="/bsafelogo.png" alt="Logo" className="w-24 h-24" />
          <h2 className="text-2xl font-semibold text-gray-800 mt-2">Selamat Datang Kembali</h2>
          <p className="text-gray-500 text-sm">Login untuk mengakses akun Bsafe</p>
        </div>

        {/* Button Login Google */}
        <div className="space-y-4">
          <Button
            className="w-full bg-white text-gray-700 border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-100"
            onClick={() => console.log("Login dengan Google")}
          >
            <FcGoogle size={20} /> Login dengan Google
          </Button>

          <p className="text-sm text-center text-gray-600">
          Jika perlu bantuan, silakan hubungi admin kami{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
