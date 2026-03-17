"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Performance = {
  totalStudents: number;
  totalAssignments: number;
  totalSubmissions: number;
  avgScore: number;
  assignments: {
    title: string;
    maxScore: number;
    submissionCount: number;
    avgScore: number;
  }[];
};

export default function TeacherPerformancePage() {
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

  const chartData = data.assignments.map((a) => ({
    name: a.title.length > 10 ? a.title.slice(0, 10) + "..." : a.title,
    คะแนนเฉลี่ย: a.avgScore,
    คนส่ง: a.submissionCount,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">ภาพรวมชั้นเรียน</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-blue-600">{data.totalStudents}</p>
          <p className="text-sm text-gray-500 mt-1">นักศึกษาทั้งหมด</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-green-600">{data.totalAssignments}</p>
          <p className="text-sm text-gray-500 mt-1">งานทั้งหมด</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-yellow-600">{data.totalSubmissions}</p>
          <p className="text-sm text-gray-500 mt-1">การส่งงานทั้งหมด</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-purple-600">{data.avgScore}</p>
          <p className="text-sm text-gray-500 mt-1">คะแนนเฉลี่ยรวม</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-4">คะแนนเฉลี่ยแต่ละงาน</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="คะแนนเฉลี่ย" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="คนส่ง" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ตาราง */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">งาน</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">คนส่ง</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">คะแนนเฉลี่ย</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.assignments.map((a, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{a.title}</td>
                <td className="px-4 py-3 text-center text-gray-600">{a.submissionCount} คน</td>
                <td className="px-4 py-3 text-center font-medium text-gray-800">
                  {a.avgScore > 0 ? `${a.avgScore}/${a.maxScore}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}