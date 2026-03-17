import { getPrisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = getPrisma();
  try {
    const session = await auth();

    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { score } = body;

    if (score === undefined || score === null) {
      return NextResponse.json({ error: "กรุณากรอกคะแนน" }, { status: 400 });
    }

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { assignment: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "ไม่พบการส่งงาน" }, { status: 404 });
    }

    if (score < 0 || score > submission.assignment.maxScore) {
      return NextResponse.json(
        { error: `คะแนนต้องอยู่ระหว่าง 0 - ${submission.assignment.maxScore}` },
        { status: 400 }
      );
    }

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        score: Number(score),
        status: "GRADED",
      },
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.error("PATCH submission error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
      { status: 500 }
    );
  }
}