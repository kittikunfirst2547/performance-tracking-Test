"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

type Performance = {
  totalAssignments: number;
  submitted: number;
  graded: number;
  late: number;
  avgScore: number;
  submissions: {
    title: string;
    score: number | null;
    maxScore: number;
    status: string;
    submittedAt: string;
  }[];
};

export default function StudentPerformancePage() {
  const [data, setData] = useState<Performance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/performance")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-500">กำลังโหลด...</p>;
  if (!data) return null;

  // เตรียมข้อมูลสำหรับ Chart
  const chartData = data.submissions
    .filter((s) => s.score !== null)
    .map((s) => ({
      name: s.title.length > 10 ? s.title.slice(0, 10) + "..." : s.title,
      คะแนน: s.score,
      เต็ม: s.maxScore,
    }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">ผลการเรียนของฉัน</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-blue-600">{data.totalAssignments}</p>
          <p className="text-sm text-gray-500 mt-1">งานทั้งหมด</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-green-600">{data.submitted}</p>
          <p className="text-sm text-gray-500 mt-1">ส่งแล้ว</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-red-600">{data.late}</p>
          <p className="text-sm text-gray-500 mt-1">ส่งช้า</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-purple-600">{data.avgScore}</p>
          <p className="text-sm text-gray-500 mt-1">คะแนนเฉลี่ย</p>
        </div>
      </div>

      {/* Chart — คะแนนแต่ละงาน */}
      {chartData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-4">คะแนนแต่ละงาน</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="คะแนน" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="เต็ม" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ตารางงานทั้งหมด */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">งาน</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">สถานะ</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">คะแนน</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.submissions.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{s.title}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    s.status === "GRADED"
                      ? "bg-green-100 text-green-700"
                      : s.status === "LATE"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {s.status === "GRADED" ? "ตรวจแล้ว" : s.status === "LATE" ? "ส่งช้า" : "รอตรวจ"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-gray-700 font-medium">
                  {s.score !== null ? `${s.score}/${s.maxScore}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}