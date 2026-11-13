"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    const result = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (result.error) { setError(result.error.message || "Unable to sign in. Check your credentials."); return; }
    router.replace("/"); router.refresh();
  }
  return <form onSubmit={submit} className="mt-8 space-y-5">
    <label className="block text-sm font-medium text-slate-700">Email address<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="you@example.com"/></label>
    <label className="block text-sm font-medium text-slate-700">Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Enter your password"/></label>
    {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
    <button disabled={loading} className="w-full rounded-xl bg-[#315efb] px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">{loading ? "Signing in…" : "Sign in to GymCRM"}</button>
  </form>;
}
