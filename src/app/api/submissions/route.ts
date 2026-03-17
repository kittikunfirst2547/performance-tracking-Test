import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET — ดึง submissions ของนักศึกษาคนนั้น
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = await prisma.submission.findMany({
    where: { studentId: session.user.id },
    include: {
      assignment: true, // ดึงข้อมูล assignment มาด้วย
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(submissions);
}

// POST — ส่งงาน
export async function POST(request: Request) {
  const session = await auth();

  if (!session || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { assignmentId, note } = body;

  // เช็คว่าส่งงานนี้ไปแล้วหรือยัง
  const existing = await prisma.submission.findFirst({
    where: {
      studentId: session.user.id,
      assignmentId,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "คุณส่งงานนี้ไปแล้ว" },
      { status: 400 }
    );
  }

  // เช็ค deadline
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment) {
    return NextResponse.json({ error: "ไม่พบงาน" }, { status: 404 });
  }

  const isLate = new Date() > new Date(assignment.deadline);

  const submission = await prisma.submission.create({
    data: {
      studentId: session.user.id,
      assignmentId,
      note,
      status: isLate ? "LATE" : "SUBMITTED",
    },
  });

  return NextResponse.json(submission, { status: 201 });
}