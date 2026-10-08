import { useState } from "react";
import ApplicationCard from "../ApplicationCard/ApplicationCard.jsx";
import { STATUS_ORDER, STATUS_COLOR } from "../../utils/statusStyles.js";

// Uses the browser's native HTML5 drag-and-drop API (no extra dependency).
// Each card sets its id via dataTransfer on drag start; each column reads it
// back on drop and reports the new status up to the parent.
export default function KanbanBoard({ applications, onStatusChange, onDelete, onView, onEdit }) {
  const [dragOverStatus, setDragOverStatus] = useState(null);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) onStatusChange(id, status);
    setDragOverStatus(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STATUS_ORDER.map((status) => {
        const columnApps = applications.filter((a) => a.status === status);
        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverStatus(status);
            }}
            onDragLeave={() => setDragOverStatus((s) => (s === status ? null : s))}
            onDrop={(e) => handleDrop(e, status)}
            className={`w-72 shrink-0 rounded-2xl border p-3 transition-colors ${
              dragOverStatus === status
                ? "border-accent-300 bg-accent-50/50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${STATUS_COLOR[status]}`} />
                <h3 className="text-sm font-semibold text-slate-700">{status}</h3>
              </div>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                {columnApps.length}
              </span>
            </div>

            <div className="space-y-3">
              {columnApps.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                  Drop a card here
                </p>
              ) : (
                columnApps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    layout="kanban"
                    draggable
                    onDragStart={handleDragStart}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
