import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus, Search, Users } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createMember } from "./actions";

export default async function MembersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const members = await prisma.member.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return <main className="min-h-screen bg-[#f7f8fa] px-5 py-8 sm:px-8 lg:px-12">
    <div className="mx-auto max-w-6xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-700"><ArrowLeft size={16}/>Dashboard</Link>
      <header className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-slate-500">GymCRM / Workspace</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Members</h1><p className="mt-2 text-sm text-slate-500">Manage your gym member records.</p></div><div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">{members.length} members</div></header>
      <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
        <section className="h-fit rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 font-semibold"><Plus size={18} className="text-blue-600"/>Add a member</div>
          <form action={createMember} className="mt-5 space-y-4">
            <label className="block text-sm font-medium">Full name<input name="fullName" required minLength={2} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500" placeholder="Member name"/></label>
            <label className="block text-sm font-medium">Phone<input name="phone" type="tel" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500" placeholder="Mobile number"/></label>
            <label className="block text-sm font-medium">Email <span className="font-normal text-slate-400">(optional)</span><input name="email" type="email" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500" placeholder="member@email.com"/></label>
            <label className="block text-sm font-medium">Member ID <span className="font-normal text-slate-400">(optional)</span><input name="memberCode" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500" placeholder="e.g. GYM-001"/></label>
            <button className="w-full rounded-xl bg-[#315efb] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">Save member</button>
          </form>
        </section>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-semibold">All members</h2><p className="mt-1 text-xs text-slate-500">Most recently added first</p></div><Users className="text-slate-400"/></div>
          {members.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-5 py-3">Member</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">Member ID</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{members.map(member=><tr key={member.id} className="border-t border-slate-100"><td className="px-5 py-4 font-medium">{member.fullName}<div className="mt-1 text-xs text-slate-400">{member.email || "No email"}</div></td><td className="px-5 py-4 text-slate-600">{member.phone || "—"}</td><td className="px-5 py-4 text-slate-600">{member.memberCode || "—"}</td><td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">{member.status}</span></td></tr>)}</tbody></table></div> : <div className="grid min-h-64 place-items-center p-8 text-center"><div><Users size={28} className="mx-auto text-slate-300"/><p className="mt-3 font-semibold">No members yet</p><p className="mt-1 text-sm text-slate-500">Add your first gym member using the form.</p></div></div>}
        </section>
      </div>
    </div>
  </main>;
}
