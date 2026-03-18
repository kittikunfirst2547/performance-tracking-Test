import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5">
        <span className="font-semibold text-gray-900 tracking-tight">
          Performance Tracking
        </span>
        <div className="flex items-center gap-2">
          <Link href="/login"
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
            เข้าสู่ระบบ
          </Link>
          <Link href="/register"
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            สมัครสมาชิก
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4 tracking-tight">
          ติดตามผลการเรียน<br />
          <span className="text-gray-900">ได้ง่ายขึ้น</span>
        </h1>

        <p className="text-gray-400 max-w-screen-sm mb-8 leading-relaxed">
          จัดการงาน ส่งงาน และดูคะแนน
          สำหรับอาจารย์และนักศึกษา
        </p>

        <div className="flex gap-2">
          <Link href="/register"
            className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-all font-medium">
            เริ่มใช้งานฟรี
          </Link>
          <Link href="/login"
            className="px-5 py-2.5 bg-white text-gray-700 text-sm rounded-xl hover:bg-gray-100 transition-all border border-gray-200 font-medium">
            เข้าสู่ระบบ
          </Link>
        </div>
      </main>

     
      {/* Footer */}
      <footer className="text-center text-xs text-gray-300 pb-8">
        Kittikun Arwear | 090-228-2073 | first1kittikun@gmail.com
      </footer>

    </div>
  );
}