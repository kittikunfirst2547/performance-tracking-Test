import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "STUDENT") {
    const submissions = await prisma.submission.findMany({
      where: { studentId: session.user.id },
      include: { assignment: true },
      orderBy: { submittedAt: "asc" },
    });

    const totalAssignments = await prisma.assignment.count();
    const submitted = submissions.length;
    const graded = submissions.filter((s) => s.status === "GRADED").length;
    const late = submissions.filter((s) => s.status === "LATE").length;
    const avgScore =
      graded > 0
        ? submissions
            .filter((s) => s.score !== null)
            .reduce((acc: number, s) => acc + (s.score ?? 0), 0) / graded  // ← เพิ่ม acc: number
        : 0;

    return NextResponse.json({
      totalAssignments,
      submitted,
      graded,
      late,
      avgScore: Math.round(avgScore * 10) / 10,
      submissions: submissions.map((s) => ({
        title: s.assignment.title,
        score: s.score,
        maxScore: s.assignment.maxScore,
        status: s.status,
        submittedAt: s.submittedAt,
      })),
    });
  }

  const assignments = await prisma.assignment.findMany({
    where: { teacherId: session.user.id },
    include: {
      submissions: {
        include: {
          student: { select: { name: true } },
        },
      },
    },
  });

  const totalStudents = await prisma.user.count({
    where: { role: "STUDENT" },
  });

  const allSubmissions = assignments.flatMap((a) => a.submissions);
  const graded = allSubmissions.filter((s) => s.status === "GRADED");
  const avgScore =
    graded.length > 0
      ? graded.reduce((acc: number, s) => acc + (s.score ?? 0), 0) / graded.length  // ← เพิ่ม acc: number
      : 0;

  return NextResponse.json({
    totalStudents,
    totalAssignments: assignments.length,
    totalSubmissions: allSubmissions.length,
    avgScore: Math.round(avgScore * 10) / 10,
    assignments: assignments.map((a) => ({
      title: a.title,
      maxScore: a.maxScore,
      submissionCount: a.submissions.length,
      avgScore:
        a.submissions.filter((s) => s.score !== null).length > 0
          ? Math.round(
              (a.submissions.reduce((acc: number, s) => acc + (s.score ?? 0), 0) /  // ← เพิ่ม acc: number
                a.submissions.filter((s) => s.score !== null).length) *
                10
            ) / 10
          : 0,
    })),
  });
}