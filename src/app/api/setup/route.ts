import { NextResponse } from "next/server";
import { hashPassword } from "better-auth/crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const setupToken = process.env.GYMCRM_SETUP_TOKEN;
  if (!setupToken) return NextResponse.json({ error: "Initial setup is disabled. Configure GYMCRM_SETUP_TOKEN temporarily." }, { status: 503 });
  const supplied = request.headers.get("x-setup-token") || "";
  if (supplied.length !== setupToken.length || !Buffer.from(supplied).equals(Buffer.from(setupToken))) {
    return NextResponse.json({ error: "Invalid setup token." }, { status: 401 });
  }

  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) return NextResponse.json({ error: "An owner account already exists. Initial setup is permanently closed." }, { status: 409 });

  const body = await request.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12) {
    return NextResponse.json({ error: "Enter a name, valid email, and password with at least 12 characters." }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { name, email, emailVerified: true } });
    await tx.account.create({
      data: { accountId: user.id, providerId: "credential", userId: user.id, password: passwordHash },
    });
    await tx.gymSettings.create({ data: { userId: user.id, gymName: "My Gym" } });
  });
  return NextResponse.json({ success: true });
}
