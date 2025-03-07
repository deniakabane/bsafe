"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const name = Cookies.get("user_name");
    const picture = Cookies.get("user_picture");
    if (name && picture) {
      setUser({ name, picture });
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/public/login/google/logout");
    Cookies.remove("user_name");
    Cookies.remove("user_picture");
    Cookies.remove("user_id");
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 p-4 border rounded">
      <img src={user.picture} className="w-12 h-12 rounded-full" alt="User" />
      <p className="text-lg">{user.name}</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
