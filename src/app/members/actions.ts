"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createMember(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const fullName = String(formData.get("fullName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const memberCode = String(formData.get("memberCode") || "").trim();
  if (fullName.length < 2) throw new Error("Enter a member name.");
  await prisma.member.create({
    data: {
      userId: session.user.id,
      fullName,
      phone: phone || null,
      email: email || null,
      memberCode: memberCode || null,
    },
  });
  revalidatePath("/members");
  revalidatePath("/");
}
