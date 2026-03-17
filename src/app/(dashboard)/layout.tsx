import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/login");

  const isTeacher = session.user?.role === "TEACHER";

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Performance Tracking</h1>
        <div className="flex items-center gap-4">
          {/* Links */}
          <a 
            href={isTeacher ? "/teacher" : "/student"}
            className="text-sm text-gray-600 hover:text-blue-600"
          >
            งาน
          </a>
           <a
            href={isTeacher ? "/teacher/performance" : "/student/performance"}
            className="text-sm text-gray-600 hover:text-blue-600"
          >
            Performance
          </a>
          <span className="text-sm text-gray-400">|</span>
          <span className="text-sm text-gray-600">
            {session.user?.name}
          </span>
           <a
            href="/api/auth/signout"
            className="text-sm text-red-500 hover:underline"
          >
            ออกจากระบบ
          </a>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}