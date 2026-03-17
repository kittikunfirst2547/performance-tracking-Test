import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b">
        <span className="font-bold text-gray-800">Performance Tracking</span>
        <div className="flex gap-3">
          <Link href="/login"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            เข้าสู่ระบบ
          </Link>
          <Link href="/register"
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors">
            สมัครสมาชิก
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
          ระบบติดตาม<br />ผลการเรียน
        </h1>
        <p className="text-gray-400 text-lg max-w-md mb-8">
          จัดการงาน ส่งงาน และติดตามคะแนน สำหรับอาจารย์และนักศึกษา
        </p>
        <div className="flex gap-3">
          <Link href="/register"
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors">
            เริ่มใช้งาน
          </Link>
          <Link href="/login"
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl font-medium hover:bg-gray-200 transition-colors">
            เข้าสู่ระบบ
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="max-w-3xl mx-auto w-full px-4 pb-20 grid grid-cols-3 gap-4">
        {[
          { icon: "📋", title: "มอบหมายงาน", desc: "สร้างงานพร้อม deadline" },
          { icon: "📤", title: "ส่งงาน", desc: "ส่งและติดตามสถานะ" },
          { icon: "📊", title: "ดูคะแนน", desc: "กราฟและสถิติภาพรวม" },
        ].map((f) => (
          <div key={f.title} className="bg-gray-50 rounded-2xl p-5">
            <div className="text-2xl mb-2">{f.icon}</div>
            <p className="font-medium text-gray-800 text-sm">{f.title}</p>
            <p className="text-gray-400 text-sm mt-1">{f.desc}</p>
          </div>
        ))}
      </section>

    </div>
  );
}