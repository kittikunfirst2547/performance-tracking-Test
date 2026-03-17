"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // สมัครสำเร็จ → ไปหน้า login
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h1 className="text-2xl tfont-bold text-gray-800 mb-6 text-center">สมัครสมาชิก</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ชื่อ */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">ชื่อ</label>
            <input
              name="name"
              type="text"
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">อีเมล</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">รหัสผ่าน</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">สมัครในฐานะ</label>
            <select
              name="role"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            >
              <option value="STUDENT">นักศึกษา</option>
              <option value="TEACHER">อาจารย์</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          มีบัญชีแล้ว?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            เข้าสู่ระบบ
          </a>
        </p>
      </div>
    </div>
  );
}
