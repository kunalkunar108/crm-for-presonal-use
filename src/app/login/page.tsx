import { Dumbbell, LockKeyhole } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/");
  return <main className="grid min-h-screen place-items-center bg-[#f5f7fb] px-5 py-10">
    <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#315efb] text-white"><Dumbbell size={23}/></div>
      <div className="mt-5 text-center"><h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1><p className="mt-2 text-sm text-slate-500">Sign in to your private GymCRM workspace.</p></div>
      <LoginForm/>
      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400"><LockKeyhole size={13}/> Private owner access · Registration is disabled</p>
    </section>
  </main>;
}
