import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

// กำหนด validation rules
const registerSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัว"),
  role: z.enum(["STUDENT", "TEACHER"]),
});

export async function POST(request: Request) {
  try {
    // 1. รับข้อมูลจาก request
    const body = await request.json();

    // 2. validate ข้อมูล
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    // 3. เช็คว่า email ซ้ำไหม
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 400 }
      );
    }

    // 4. เข้ารหัส password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. สร้าง user ใหม่
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json(
      { message: "สมัครสมาชิกสำเร็จ", userId: user.id },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
      { status: 500 }
    );
  }
}
