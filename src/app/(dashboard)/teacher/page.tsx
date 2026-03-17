"use client";

import { useState, useEffect } from "react";

type Assignment = {
  id: string;
  title: string;
  description: string;
  maxScore: number;
  deadline: string;
  _count: { submissions: number };
};

type Submission = {
  id: string;
  note: string | null;
  score: number | null;
  status: string;
  submittedAt: string;
  student: { id: string; name: string; email: string };
  assignment: { id: string; title: string; maxScore: number };
};

export default function TeacherPage() {
  const [tab, setTab] = useState<"assignments" | "submissions">("assignments");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const [assignRes, subRes] = await Promise.all([
      fetch("/api/assignments"),
      fetch("/api/submissions/all"),
    ]);
    const assignData = await assignRes.json();
    const subData = await subRes.json();
    setAssignments(assignData);
    setSubmissions(subData);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      maxScore: Number(formData.get("maxScore")),
      deadline: formData.get("deadline"),
    };

    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const result = await res.json();
      setError(result.error);
      return;
    }

    setShowForm(false);
    fetchAll();
  }

  async function handleGrade(submissionId: string) {
  setError("");

  const res = await fetch(`/api/submissions/${submissionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score: Number(score) }), // ← Number() ให้แน่ใจ
  });

  // เช็ค content-type ก่อน parse JSON
  const text = await res.text();
  
  if (!res.ok) {
    try {
      const result = JSON.parse(text);
      setError(result.error || "เกิดข้อผิดพลาด");
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    return;
  }

  setGradingId(null);
  setScore(0);
  fetchAll();
}

  function getStatusStyle(status: string) {
    switch (status) {
      case "GRADED": return "bg-green-100 text-green-700";
      case "LATE": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case "GRADED": return "ตรวจแล้ว";
      case "LATE": return "ส่งช้า";
      default: return "รอตรวจ";
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setTab("assignments")}
          className={`pb-2 px-1 font-medium text-sm ${
            tab === "assignments"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          งานที่มอบหมาย
        </button>
        <button
          onClick={() => setTab("submissions")}
          className={`pb-2 px-1 font-medium text-sm ${
            tab === "submissions"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          การส่งงาน ({submissions.length})
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">กำลังโหลด...</p>
      ) : tab === "assignments" ? (
        // ── Tab 1: Assignments ──
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">งานทั้งหมด</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              + สร้างงานใหม่
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-4">
              <h3 className="font-semibold mb-4">สร้างงานใหม่</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ชื่องาน</label>
                  <input name="title" type="text" required
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">รายละเอียด</label>
                  <textarea name="description" required rows={3}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">คะแนนเต็ม</label>
                    <input name="maxScore" type="number" defaultValue={100} required
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">กำหนดส่ง</label>
                    <input name="deadline" type="datetime-local" required
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-2">
                  <button type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    สร้าง
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Assignment List */}
          <div className="space-y-4">
            {assignments.map((a) => (
              <div key={a.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{a.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{a.description}</p>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {a._count.submissions} คนส่งแล้ว
                  </span>
                </div>
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span>คะแนนเต็ม: {a.maxScore}</span>
                  <span>กำหนดส่ง: {new Date(a.deadline).toLocaleDateString("th-TH")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ── Tab 2: Submissions ──
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">การส่งงานทั้งหมด</h2>
          {submissions.length === 0 ? (
            <p className="text-gray-500">ยังไม่มีนักศึกษาส่งงาน</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((s) => (
                <div key={s.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{s.student.name}</p>
                      <p className="text-sm text-gray-500">{s.student.email}</p>
                      <p className="text-sm text-blue-600 mt-1">งาน: {s.assignment.title}</p>
                      {s.note && (
                        <p className="text-sm text-gray-600 mt-1">หมายเหตุ: {s.note}</p>
                      )}
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${getStatusStyle(s.status)}`}>
                      {getStatusText(s.status)}
                    </span>
                  </div>

                  <div className="flex gap-4 mt-3 text-sm text-gray-500">
                    <span>ส่งเมื่อ: {new Date(s.submittedAt).toLocaleDateString("th-TH")}</span>
                    {s.score !== null && (
                      <span className="text-green-600 font-medium">
                        คะแนน: {s.score}/{s.assignment.maxScore}
                      </span>
                    )}
                  </div>

                  {/* ให้คะแนน */}
                  {s.status !== "GRADED" && (
                    <div className="mt-3">
                      {gradingId === s.id ? (
                        <div className="flex items-center gap-2">
                          <input
  type="number"
  value={score === 0 ? "" : score}
  onChange={(e) => setScore(e.target.value === "" ? 0 : Number(e.target.value))}
  onFocus={(e) => e.target.select()}
  placeholder="0"
  min={0}
  max={s.assignment.maxScore}
  className="border rounded-lg px-3 py-1 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
                          <span className="text-sm text-gray-500">
                            / {s.assignment.maxScore}
                          </span>
                          <button
                            onClick={() => handleGrade(s.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
                          >
                            บันทึกคะแนน
                          </button>
                          <button
                            onClick={() => setGradingId(null)}
                            className="bg-gray-200 px-3 py-1 rounded-lg text-sm hover:bg-gray-300"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setGradingId(s.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
                        >
                          ให้คะแนน
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
