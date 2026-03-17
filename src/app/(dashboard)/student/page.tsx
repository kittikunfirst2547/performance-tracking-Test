"use client";

import { useState, useEffect } from "react";

type Assignment = {
  id: string;
  title: string;
  description: string;
  maxScore: number;
  deadline: string;
};

type Submission = {
  id: string;
  note: string;
  score: number | null;
  status: string;
  submittedAt: string;
  assignment: Assignment;
};

export default function StudentPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [assignRes, subRes] = await Promise.all([
      fetch("/api/assignments"),
      fetch("/api/submissions"),
    ]);

    const assignData = await assignRes.json();
    const subData = await subRes.json();

    setAssignments(assignData);
    setSubmissions(subData);
    setLoading(false);
  }

  // เช็คว่างานนี้ส่งไปแล้วหรือยัง
  function getSubmission(assignmentId: string) {
    return submissions.find((s) => s.assignment.id === assignmentId);
  }

  // เช็คว่าเลย deadline หรือยัง
  function isLate(deadline: string) {
    return new Date() > new Date(deadline);
  }

  async function handleSubmit(assignmentId: string) {
    setError("");

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId, note }),
    });

    if (!res.ok) {
      const result = await res.json();
      setError(result.error);
      return;
    }

    setSelectedAssignment(null);
    setNote("");
    fetchData(); // รีเฟรชข้อมูล
  }

  // สีของ status
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">งานที่ได้รับมอบหมาย</h2>

      {loading ? (
        <p className="text-gray-500">กำลังโหลด...</p>
      ) : assignments.length === 0 ? (
        <p className="text-gray-500">ยังไม่มีงาน</p>
      ) : (
        <div className="space-y-4">
          {assignments.map((a) => {
            const submission = getSubmission(a.id);
            const late = isLate(a.deadline);

            return (
              <div key={a.id} className="bg-white p-6 rounded-lg shadow">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{a.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{a.description}</p>
                  </div>

                  {/* Status Badge */}
                  {submission ? (
                    <span className={`text-sm px-2 py-1 rounded ${getStatusStyle(submission.status)}`}>
                      {getStatusText(submission.status)}
                    </span>
                  ) : late ? (
                    <span className="text-sm px-2 py-1 rounded bg-red-100 text-red-700">
                      เลยกำหนด
                    </span>
                  ) : (
                    <span className="text-sm px-2 py-1 rounded bg-gray-100 text-gray-700">
                      ยังไม่ส่ง
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span>คะแนนเต็ม: {a.maxScore}</span>
                  <span>กำหนดส่ง: {new Date(a.deadline).toLocaleDateString("th-TH")}</span>
                  {submission?.score !== null && submission?.score !== undefined && (
                    <span className="text-green-600 font-medium">
                      คะแนนที่ได้: {submission.score}/{a.maxScore}
                    </span>
                  )}
                </div>

                {/* ปุ่มส่งงาน */}
                {!submission && (
                  <div className="mt-4">
                    {selectedAssignment === a.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="หมายเหตุ (ถ้ามี)"
                          rows={2}
                          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSubmit(a.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                          >
                            ยืนยันส่งงาน
                          </button>
                          <button
                            onClick={() => setSelectedAssignment(null)}
                            className="bg-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedAssignment(a.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                      >
                        ส่งงาน
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
