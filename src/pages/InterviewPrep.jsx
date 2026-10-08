import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, MessageSquareText, Sparkles, Target } from "lucide-react";
import { useApplications } from "../context/ApplicationsContext.jsx";
import { useProfile } from "../context/ProfileContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { generateInterviewPrep } from "../utils/interviewPrep.js";
import { useNavigate, useSearchParams } from "react-router-dom";

function formatDate(value) { return value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "No interview scheduled"; }

export default function InterviewPrep() {
  const { applications, updateApplication } = useApplications();
  const { profile } = useProfile();
  const { showToast } = useToast();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const interviewApps = applications.filter((a) => ["Interview", "Shortlisted"].includes(a.status));
  const [selectedId, setSelectedId] = useState(params.get("application") || interviewApps[0]?.id || "");
  const selected = applications.find((a) => a.id === selectedId) || interviewApps[0];
  const prep = useMemo(() => selected ? generateInterviewPrep(selected, profile) : null, [selected, profile]);
  const [checked, setChecked] = useState(() => selected?.prepChecklist || {});

  if (!selected) return <EmptyPrep onGo={() => navigate("/applications")} />;

  const progress = Math.round((Object.values(checked).filter(Boolean).length / prep.questions.length) * 100);
  const toggle = (index) => {
    const next = { ...checked, [index]: !checked[index] };
    setChecked(next);
    updateApplication(selected.id, { prepChecklist: next, prepProgress: Math.round((Object.values(next).filter(Boolean).length / prep.questions.length) * 100) });
  };

  return <div className="space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><div className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700"><Sparkles size={14}/> Interview Prep</div><h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Prepare with a clear plan.</h1><p className="mt-2 text-sm text-slate-500">Practice role-specific, skill-based and behavioral questions for each interview.</p></div>
      <select value={selected.id} onChange={(e) => { setSelectedId(e.target.value); setChecked(applications.find(a => a.id === e.target.value)?.prepChecklist || {}); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium">
        {interviewApps.map(a => <option key={a.id} value={a.id}>{a.company} — {a.role}</option>)}
      </select>
    </header>

    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-accent-600">{selected.company}</p><h2 className="mt-1 text-xl font-bold text-slate-900">{selected.role}</h2><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><CalendarDays size={14}/>{formatDate(selected.interviewDate)}</p></div><div className="text-right"><p className="text-2xl font-bold text-accent-600">{progress}%</p><p className="text-xs text-slate-400">prepared</p></div></div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-accent-600 transition-all" style={{width:`${progress}%`}}/></div>
        <div className="mt-6 space-y-2">
          {prep.questions.map((q, i) => <button key={q} onClick={() => toggle(i)} className={`flex w-full gap-3 rounded-xl border p-3 text-left ${checked[i] ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 hover:border-accent-200"}`}><CheckCircle2 size={18} className={checked[i] ? "text-emerald-500" : "text-slate-300"}/><span className="text-sm leading-6 text-slate-700">{q}</span></button>)}
        </div>
      </section>
      <aside className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Target size={18} className="text-accent-600"/><h2 className="font-semibold">Focus areas</h2></div><div className="mt-4 space-y-3">{prep.focusAreas.map((x,i)=><div key={i} className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">{x}</div>)}</div></section>
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5"><div className="flex items-center gap-2 text-indigo-700"><MessageSquareText size={18}/><h2 className="font-semibold">Quick practice</h2></div><p className="mt-2 text-sm leading-6 text-indigo-900/80">Answer out loud, keep responses structured, and use concrete project examples.</p><button onClick={() => { updateApplication(selected.id,{status:"Interview",prepProgress:progress}); showToast("Interview preparation progress saved."); }} className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Save Progress</button></section>
      </aside>
    </div>
  </div>;
}
function EmptyPrep({onGo}) { return <div className="flex min-h-[60vh] items-center justify-center"><div className="max-w-md text-center"><MessageSquareText className="mx-auto text-slate-300" size={44}/><h1 className="mt-4 text-xl font-bold">No interview preparation yet</h1><p className="mt-2 text-sm text-slate-500">Move an application to Shortlisted or Interview, then prepare here.</p><button onClick={onGo} className="mt-5 rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white">Open Applications</button></div></div>;}
