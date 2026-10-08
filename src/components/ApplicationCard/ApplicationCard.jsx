import { MapPin, Briefcase as BriefcaseIcon, Trash2, Pencil, ChevronRight } from "lucide-react";
import StatusBadge from "../StatusBadge/StatusBadge.jsx";
import { STATUS_ORDER } from "../../utils/statusStyles.js";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

/**
 * layout="kanban" → compact vertical card for a Kanban column.
 * layout="list"   → wider horizontal row with an inline status changer.
 * Both share the same data shape and actions so we don't duplicate markup
 * for two nearly-identical presentations of the same entity.
 */
export default function ApplicationCard({
  application,
  layout = "kanban",
  draggable = false,
  onDragStart,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const skillsToShow = application.skills.slice(0, 3);
  const extraSkills = application.skills.length - skillsToShow.length;

  const avatar = (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700">
      {initials(application.company)}
    </div>
  );

  const skillChips = (
    <div className="flex flex-wrap gap-1.5">
      {skillsToShow.map((s) => (
        <span
          key={s}
          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
        >
          {s}
        </span>
      ))}
      {extraSkills > 0 && (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
          +{extraSkills}
        </span>
      )}
    </div>
  );

  const editButton = (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onEdit?.(application);
      }}
      aria-label={`Edit application to ${application.company}`}
      className="rounded-lg p-1.5 text-slate-300 hover:bg-accent-50 hover:text-accent-600"
    >
      <Pencil size={15} />
    </button>
  );

  const deleteButton = (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete?.(application.id);
      }}
      aria-label={`Delete application to ${application.company}`}
      className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500"
    >
      <Trash2 size={15} />
    </button>
  );

  if (layout === "list") {
    return (
      <div
        onClick={() => onView?.(application.id)}
        className="card flex cursor-pointer flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-accent-200 hover:shadow-md sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center gap-3">
          {avatar}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{application.company}</p>
            <p className="truncate text-xs text-slate-500">{application.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 sm:w-40">
          <MapPin size={13} />
          {application.location}
          <span className="text-slate-300">•</span>
          {application.jobType}
        </div>

        <div className="sm:w-44">{skillChips}</div>

        <p className="text-xs text-slate-400 sm:w-24">Applied {formatDate(application.appliedDate)}</p>

        <select
          value={application.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onStatusChange?.(application.id, e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 sm:w-32"
        >
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          {editButton}
          {deleteButton}
          <ChevronRight size={16} className="text-slate-300" />
        </div>
      </div>
    );
  }

  // Kanban layout
  return (
    <div
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, application.id)}
      onClick={() => onView?.(application.id)}
      className="card cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-accent-200 hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {avatar}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{application.company}</p>
            <p className="truncate text-xs text-slate-500">{application.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {editButton}
          {deleteButton}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
        <MapPin size={12} />
        {application.location}
        <span className="text-slate-300">•</span>
        <BriefcaseIcon size={12} />
        {application.jobType}
      </div>

      <div className="mt-3">{skillChips}</div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <p className="text-xs text-slate-400">Applied {formatDate(application.appliedDate)}</p>
        <StatusBadge status={application.status} />
      </div>

      {application.nextAction && (
        <p className="mt-2 truncate text-xs font-medium text-accent-600">{application.nextAction}</p>
      )}
    </div>
  );
}
