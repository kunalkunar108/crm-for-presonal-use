import { Activity, Bell, CalendarDays, ChevronDown, CircleDollarSign, Dumbbell, LayoutDashboard, Plus, Search, Settings, Users, UserRoundPlus, Wallet } from "lucide-react";

const stats = [
  { label:"Total members", note:"Live count after database setup", icon:Users },
  { label:"Active memberships", note:"Current membership overview", icon:Activity },
  { label:"Revenue this month", note:"Payments recorded this month", icon:Wallet },
  { label:"Today's attendance", note:"Member check-ins today", icon:CalendarDays },
];
const nav = [{label:"Dashboard",icon:LayoutDashboard,active:true},{label:"Members",icon:Users},{label:"Leads & follow-ups",icon:UserRoundPlus},{label:"Memberships",icon:Dumbbell},{label:"Attendance",icon:CalendarDays},{label:"Payments",icon:Wallet}];
const actions = [{label:"Add member",icon:UserRoundPlus},{label:"Record payment",icon:CircleDollarSign},{label:"Mark attendance",icon:CalendarDays},{label:"Add lead",icon:Plus}];

export default function Home() {
  return <main className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
    <aside className="hidden border-r border-[var(--line)] bg-white px-5 py-7 lg:flex lg:flex-col">
      <div className="mb-10 flex items-center gap-3 px-2"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#315efb] text-white"><Dumbbell size={21}/></div><div><div className="text-lg font-bold">GymCRM</div><div className="text-[10px] tracking-widest text-slate-400">PERSONAL WORKSPACE</div></div></div>
      <div className="mb-3 px-3 text-[10px] font-bold tracking-[.16em] text-slate-400">WORKSPACE</div>
      <nav className="space-y-1">{nav.map(({label,icon:Icon,active})=><a key={label} href="#" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${active?"bg-blue-50 font-semibold text-blue-700":"text-slate-600 hover:bg-slate-50"}`}><Icon size={18}/>{label}</a>)}</nav>
      <div className="mb-3 mt-9 px-3 text-[10px] font-bold tracking-[.16em] text-slate-400">PREFERENCES</div>
      <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600"><Settings size={18}/>Settings</a>
      <div className="mt-auto rounded-2xl bg-slate-50 p-4"><div className="text-xs font-semibold">Personal account</div><p className="mt-1 text-xs leading-5 text-slate-500">Private workspace for your gym operations.</p></div>
    </aside>
    <section className="min-w-0 px-5 py-6 sm:px-8 lg:px-10 lg:py-9">
      <header className="mb-9 flex items-center justify-between gap-4"><div><div className="text-sm text-slate-500">Personal workspace / Overview</div><h1 className="mt-1 text-3xl font-bold tracking-tight">Dashboard</h1><p className="mt-1 text-sm text-slate-500">Your gym at a glance.</p></div><div className="flex gap-2"><button aria-label="Search" className="grid h-10 w-10 place-items-center rounded-xl border bg-white"><Search size={18}/></button><button aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-xl border bg-white"><Bell size={18}/></button><button className="hidden items-center gap-2 rounded-xl border bg-white px-3 text-sm sm:flex">Owner account <ChevronDown size={15}/></button></div></header>
      <div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold">Overview</h2><p className="mt-1 text-xs text-slate-500">Connect your database to load live figures.</p></div><button className="flex items-center gap-2 rounded-xl bg-[#315efb] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16}/>Quick action</button></div>
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">{stats.map(({label,note,icon:Icon})=><article key={label} className="rounded-2xl border border-[var(--line)] bg-white p-5"><div className="flex items-center justify-between text-sm text-slate-500">{label}<span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-600"><Icon size={18}/></span></div><div className="mt-5 text-3xl font-bold">—</div><p className="mt-2 text-xs text-slate-500">{note}</p></article>)}</div>
      <div className="mt-7 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-[var(--line)] bg-white p-6"><h3 className="font-semibold">Revenue overview</h3><p className="mt-1 text-xs text-slate-500">Monthly payment trends</p><div className="mt-6 flex h-48 items-center justify-center rounded-xl border border-dashed bg-slate-50/60 text-center"><div><CircleDollarSign className="mx-auto mb-2 text-slate-400"/><p className="text-sm font-medium text-slate-600">No revenue data yet</p><p className="mt-1 text-xs text-slate-400">Add payments to build your report</p></div></div></article>
        <article className="rounded-2xl border border-[var(--line)] bg-white p-6"><h3 className="font-semibold">Quick actions</h3><p className="mt-1 text-xs text-slate-500">Common tasks</p><div className="mt-5 grid grid-cols-2 gap-3">{actions.map(({label,icon:Icon})=><button key={label} className="flex min-h-24 flex-col items-start justify-between rounded-xl border border-[var(--line)] p-4 text-left hover:bg-blue-50/40"><Icon size={19} className="text-blue-600"/><span className="text-xs font-semibold">{label}</span></button>)}</div></article>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">{["Recent activity","Upcoming follow-ups"].map((title)=><article key={title} className="rounded-2xl border border-[var(--line)] bg-white p-6"><h3 className="font-semibold">{title}</h3><p className="mt-1 text-xs text-slate-500">Latest gym updates and reminders</p><div className="flex h-28 items-center justify-center text-sm text-slate-400">Nothing to show yet</div></article>)}</div>
      <footer className="mt-8 border-t border-[var(--line)] pt-5 text-xs text-slate-400">GymCRM Personal Edition · Private gym management workspace</footer>
    </section>
  </main>;
}
