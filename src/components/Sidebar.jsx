"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Key, Bell, LifeBuoy } from "lucide-react"; // Ikon dari Lucide React

const menuItems = [
  { name: "Data Diri", href: "/akun/edit-profile", icon: <User className="w-5 h-5" /> },
  { name: "Pelatihan", href: "/akun/pelatihan", icon: <Key className="w-5 h-5" /> },
  { name: "SKP", href: "/akun/skp", icon: <Bell className="w-5 h-5" /> },
  { name: "Modul", href: "/akun/modul", icon: <LifeBuoy className="w-5 h-5" /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r p-6 flex flex-col shadow-lg">
      {/* Bagian Profil di Sidebar */}
      <div className="flex flex-col items-center border-b pb-4 mb-4">
        <img
          src="/bsafelogo.png"
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover mb-2"
        />
        <h2 className="text-base font-semibold text-gray-800">Nanda Fahriansyah</h2>
        <h4 className="text-sm text-gray-500">Nanda@gmail.com</h4>
      </div>

      {/* Menu Navigasi */}
      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Members</h3>
      <nav className="space-y-2 flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href} className="block">
            <span
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-purple-100 hover:text-blue-800 transition ${
                pathname === item.href ? "bg-blue-950 text-white" : ""
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
