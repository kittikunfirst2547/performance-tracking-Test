import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// กำหนด Schema validation สำหรับ login form
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt", // เก็บ session แบบ JWT
  },
  pages: {
    signIn: "/login", // หน้า login ของเรา
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // 1. Validate ข้อมูลที่รับมา
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // 2. หา user จาก database
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user) return null;

        // 3. เช็ค password
        const isValid = await bcrypt.compare(
          parsed.data.password,
          user.password
        );
        if (!isValid) return null;

        // 4. คืนค่า user กลับไป
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // เพิ่ม role ลงใน JWT token
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // เพิ่ม role ลงใน session
    session({ session, token }) {
      session.user.role = token.role as string;
      session.user.id = token.id as string;
      return session;
    },
  },
});