import { getPrisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const assignmentSchema = z.object({
  title: z.string().min(1, "กรุณากรอกชื่องาน"),
  description: z.string().min(1, "กรุณากรอกรายละเอียด"),
  maxScore: z.number().min(1),
  deadline: z.string(),
});

// GET — ดึง assignments ทั้งหมด
export async function GET() {
  const prisma = getPrisma();
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Teacher ดูได้เฉพาะที่ตัวเองสร้าง
  if (session.user.role === "TEACHER") {
    const assignments = await prisma.assignment.findMany({
      where: { teacherId: session.user.id },
      include: {
        _count: { select: { submissions: true } }, // นับจำนวนการส่งงาน
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(assignments);
  }

  // Student ดูได้ทั้งหมด
  const assignments = await prisma.assignment.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(assignments);
}

// POST — สร้าง assignment ใหม่ (เฉพาะ Teacher)
export async function POST(request: Request) {
  const prisma = getPrisma();
  const session = await auth();

  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = assignmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const assignment = await prisma.assignment.create({
    data: {
      ...parsed.data,
      deadline: new Date(parsed.data.deadline),
      teacherId: session.user.id,
    },
  });

  return NextResponse.json(assignment, { status: 201 });
}