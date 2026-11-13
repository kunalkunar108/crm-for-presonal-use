import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SetupForm } from "./setup-form";

export default async function SetupPage() {
  const users = await prisma.user.count();
  if (users > 0) redirect("/login");
  return <main className="grid min-h-screen place-items-center bg-[#f5f7fb] px-5 py-10"><section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10"><div className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">GymCRM · First-time setup</div><h1 className="mt-3 text-2xl font-bold tracking-tight">Create your owner account</h1><p className="mt-2 text-sm leading-6 text-slate-500">This one-time setup is available only while the database has no users. Public registration stays disabled afterward.</p><SetupForm/></section></main>;
}
