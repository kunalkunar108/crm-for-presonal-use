"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function SetupForm() {
  const router = useRouter();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [token,setToken]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const response=await fetch("/api/setup",{method:"POST",headers:{"Content-Type":"application/json","x-setup-token":token},body:JSON.stringify({name,email,password})});
      const data=await response.json();
      if(!response.ok) { setError(data.error || "Setup failed."); setBusy(false); return; }
      router.push("/login");
    } catch { setError("Could not complete setup. Check your connection and try again."); }
    setBusy(false);
  }
  return <form onSubmit={submit} className="mt-7 space-y-4">
    <label className="block text-sm font-medium">Owner name<input required minLength={2} value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"/></label>
    <label className="block text-sm font-medium">Owner email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"/></label>
    <label className="block text-sm font-medium">Password<input required minLength={12} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"/><span className="mt-1 block text-xs font-normal text-slate-400">Use at least 12 characters.</span></label>
    <label className="block text-sm font-medium">One-time setup token<input required type="password" value={token} onChange={e=>setToken(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"/></label>
    {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
    <button disabled={busy} className="w-full rounded-xl bg-[#315efb] px-4 py-3 font-semibold text-white disabled:opacity-60">{busy?"Creating owner…":"Create owner account"}</button>
  </form>;
}
