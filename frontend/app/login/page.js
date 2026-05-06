"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (user === "admin" && pass === "1234") {
      localStorage.setItem("auth", "true");
      router.push("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 border border-white/20">

        <h2 className="text-2xl font-bold text-center text-white mb-6">
          🔐 Admin Login
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label className="text-gray-300 text-sm">Username</label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter username"
            className="w-full mt-1 p-3 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-gray-300 text-sm">Password</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Enter password"
            className="w-full mt-1 p-3 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold text-white hover:scale-105 transition shadow-lg"
        >
          Login
        </button>

      </div>
    </div>
  );
}