import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET — Teacher ดู submissions ทั้งหมดของงานตัวเอง
export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = await prisma.submission.findMany({
    where: {
      assignment: {
        teacherId: session.user.id,
      },
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignment: {
        select: {
          id: true,
          title: true,
          maxScore: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(submissions);
}