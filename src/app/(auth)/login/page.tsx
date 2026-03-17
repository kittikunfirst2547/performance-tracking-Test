"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    // signIn มาจาก next-auth/react
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false, // ไม่ให้ NextAuth redirect เอง
    });

    if (result?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setLoading(false);
      return;
    }

    // Login สำเร็จ → ดึง session เพื่อเช็ค role
    const res = await fetch("/api/auth/session");
    const session = await res.json();

    // redirect ตาม role
    if (session?.user?.role === "TEACHER") {
      router.push("/teacher");
    } else {
      router.push("/student");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">เข้าสู่ระบบ</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
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
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          ยังไม่มีบัญชี?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            สมัครสมาชิก
          </a>
        </p>
      </div>
    </div>
  );
}