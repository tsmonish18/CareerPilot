// Single source of truth for status colors/labels, used by Dashboard, the
// Application Tracker (Kanban + List), and later Application Details/Analytics.

export const STATUS_ORDER = ["Applied", "Shortlisted", "Interview", "Offer", "Rejected"];

// Solid color — used for chart bars and kanban column accents
export const STATUS_COLOR = {
  Applied: "bg-slate-400",
  Shortlisted: "bg-amber-400",
  Interview: "bg-accent-500",
  Offer: "bg-emerald-500",
  Rejected: "bg-rose-400",
};

// Soft badge (bg + text) — used on cards/rows
export const STATUS_BADGE = {
  Applied: "bg-slate-100 text-slate-700",
  Shortlisted: "bg-amber-100 text-amber-700",
  Interview: "bg-accent-100 text-accent-700",
  Offer: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-700",
};
