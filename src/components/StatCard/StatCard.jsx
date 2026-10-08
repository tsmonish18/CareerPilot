// A single dashboard metric tile. Kept generic so Analytics (Phase 10) can reuse it too.
// `trend` is an optional short string (e.g. "+2 this week") shown under the value.
export default function StatCard({ label, value, icon: Icon, accent = "indigo", trend }) {
  const accentClasses = {
    indigo: "bg-accent-50 text-accent-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentClasses[accent]}`}
        >
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      {trend && <p className="mt-1 text-xs font-medium text-emerald-600">{trend}</p>}
    </div>
  );
}
