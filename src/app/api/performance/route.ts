import { getPrisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const prisma = getPrisma();
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

    type Sub = typeof submissions[number];

    const totalAssignments = await prisma.assignment.count();
    const submitted = submissions.length;
    const graded = submissions.filter((s: Sub) => s.status === "GRADED").length;
    const late = submissions.filter((s: Sub) => s.status === "LATE").length;
    const avgScore =
      graded > 0
        ? submissions
            .filter((s: Sub) => s.score !== null)
            .reduce((acc: number, s: Sub) => acc + (s.score ?? 0), 0) / graded
        : 0;

    return NextResponse.json({
      totalAssignments,
      submitted,
      graded,
      late,
      avgScore: Math.round(avgScore * 10) / 10,
      submissions: submissions.map((s: Sub) => ({
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

  // ← เพิ่ม type ตรงนี้
  type AssignmentWithSubs = typeof assignments[number];
  type SubWithStudent = AssignmentWithSubs["submissions"][number];

  const totalStudents = await prisma.user.count({
    where: { role: "STUDENT" },
  });

  const allSubmissions = assignments.flatMap((a: AssignmentWithSubs) => a.submissions);
  const graded = allSubmissions.filter((s: SubWithStudent) => s.status === "GRADED");
  const avgScore =
    graded.length > 0
      ? graded.reduce((acc: number, s: SubWithStudent) => acc + (s.score ?? 0), 0) / graded.length
      : 0;

  return NextResponse.json({
    totalStudents,
    totalAssignments: assignments.length,
    totalSubmissions: allSubmissions.length,
    avgScore: Math.round(avgScore * 10) / 10,
    assignments: assignments.map((a: AssignmentWithSubs) => ({
      title: a.title,
      maxScore: a.maxScore,
      submissionCount: a.submissions.length,
      avgScore:
        a.submissions.filter((s: SubWithStudent) => s.score !== null).length > 0
          ? Math.round(
              (a.submissions.reduce((acc: number, s: SubWithStudent) => acc + (s.score ?? 0), 0) /
                a.submissions.filter((s: SubWithStudent) => s.score !== null).length) * 10
            ) / 10
          : 0,
    })),
  });
}