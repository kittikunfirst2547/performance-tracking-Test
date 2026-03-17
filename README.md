# Performance Tracking

แอปนี้เป็นระบบติดตามผลการเรียน (Performance Tracking) ที่พัฒนาด้วย **Next.js**, **Prisma**, และ **NextAuth** โดยออกแบบให้รองรับการใช้งานของนักเรียนและครูในการดูผลการบ้าน/การส่งงาน และการวัดผลการเรียนรู้

## 🔍 โครงสร้างหลักของโปรเจกต์

- `src/app/` – หน้าเว็บหลัก (Route / App Router)
- `src/app/(auth)` – หน้าเข้าสู่ระบบ / ลงทะเบียน
- `src/app/(dashboard)` – หน้าจัดการหลังล็อกอิน (นักเรียน/ครู)
- `src/app/api/` – API routes (เช่น auth, register, assignments, performance, submissions)
- `src/lib/` – ไลบรารีช่วยเหลือ (เชื่อมต่อ Prisma, ตั้งค่าการตรวจสอบสิทธิ์)
- `prisma/schema.prisma` – โมเดลฐานข้อมูล

## 🚀 เริ่มต้นใช้งาน (Development)

1. ติดตั้ง dependencies:

```bash
npm install
```

2. สร้างไฟล์ `.env` จากตัวอย่าง `.env.example` (ถ้ามี) แล้วตั้งค่า:

- `DATABASE_URL` (เชื่อมต่อฐานข้อมูล PostgreSQL หรือ SQLite ตามที่ตั้งไว้)
- `NEXTAUTH_SECRET` (สำหรับ NextAuth)
- `NEXTAUTH_URL` (เช่น `http://localhost:3000`)

3. สร้างและอัปเดตฐานข้อมูลด้วย Prisma:

```bash
npx prisma migrate dev
```

4. รันเซิร์ฟเวอร์สำหรับพัฒนา:

```bash
npm run dev
```

5. เปิดเบราว์เซอร์ที่:

```
http://localhost:3000
```

## 🧑‍🏫 ฟีเจอร์หลัก

- ระบบ **ลงทะเบียน/เข้าสู่ระบบ** (NextAuth)
- แยกผู้ใช้งานเป็น **นักเรียน** และ **ครู**
- ครูสามารถดู/เพิ่ม/แก้ไข คะแนนหรือการบ้านของนักเรียนได้
- นักเรียนสามารถดูผลการเรียนและการส่งงานของตนเอง

## 🧩 คำแนะนำเพิ่มเติม

- ถ้าต้องการดูโครงสร้างฐานข้อมูล ให้ดูไฟล์ `prisma/schema.prisma`
- API หลักอยู่ใต้ `src/app/api/` (เช่น `performance/route.ts`, `assignments/route.ts`)

## 🛠️ คำสั่งที่น่าสนใจ

- `npm run dev` — รันเซิร์ฟเวอร์ในโหมดพัฒนา
- `npm run build` — สร้างโปรเจกต์สำหรับนำขึ้น production
- `npm run start` — รันแอปใน production mode
- `npx prisma studio` — เปิด UI ของ Prisma เพื่อดูข้อมูลในฐานข้อมูล

---

หากต้องการให้ช่วยอธิบายส่วนใดเพิ่มเติม (เช่น การตั้งค่า auth, model, หรือการเพิ่มหน้าฟีเจอร์ใหม่) แจ้งมาได้เลย 😊
