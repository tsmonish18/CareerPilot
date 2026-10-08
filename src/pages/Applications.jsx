import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, LayoutGrid, List as ListIcon, Briefcase } from "lucide-react";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard.jsx";
import ApplicationCard from "../components/ApplicationCard/ApplicationCard.jsx";
import EmptyState from "../components/EmptyState/EmptyState.jsx";
import Modal from "../components/Modal/Modal.jsx";
import ApplicationForm from "../components/ApplicationForm/ApplicationForm.jsx";
import { useApplications } from "../context/ApplicationsContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { STATUS_ORDER } from "../utils/statusStyles.js";

export default function Applications() {
  const navigate = useNavigate();
  const { applications, addApplication, updateApplication, updateStatus, deleteApplication } =
    useApplications();
  const { showToast } = useToast();

  const [view, setView] = useState("kanban");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("newest");

  // null = closed, "new" = add mode, an application object = edit mode
  const [modalTarget, setModalTarget] = useState(null);

  const filtered = useMemo(() => {
    let list = applications.filter((app) => {
      const matchesSearch =
        app.company.toLowerCase().includes(search.toLowerCase()) ||
        app.role.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    list = [...list].sort((a, b) =>
      sort === "newest"
        ? new Date(b.appliedDate) - new Date(a.appliedDate)
        : new Date(a.appliedDate) - new Date(b.appliedDate)
    );

    return list;
  }, [applications, search, statusFilter, sort]);

  const handleDelete = (id) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    if (window.confirm(`Remove your application to ${app.company}? This can't be undone.`)) {
      deleteApplication(id);
      showToast(`Removed ${app.company} from your tracker.`);
    }
  };

  const handleView = (id) => navigate(`/applications/${id}`);

  const handleFormSubmit = (values) => {
    if (modalTarget === "new") {
      addApplication(values);
      showToast(`Added your application to ${values.company}.`);
    } else {
      updateApplication(modalTarget.id, values);
      showToast(`Updated your application to ${values.company}.`);
    }
    setModalTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Applications</h1>
          <p className="mt-1 text-sm text-slate-500">
            {applications.length} application{applications.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <button
          onClick={() => setModalTarget("new")}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-700 sm:self-auto"
        >
          <Plus size={16} />
          Add Application
        </button>
      </div>

      {/* Toolbar: search, filter, sort, view toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or role..."
              aria-label="Search applications"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-accent-400 focus:outline-none"
          >
            <option value="All">All statuses</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort applications"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-accent-400 focus:outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {/* View toggle */}
        <div className="flex shrink-0 rounded-xl border border-slate-200 bg-white p-1">
          <button
            onClick={() => setView("kanban")}
            aria-pressed={view === "kanban"}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
              view === "kanban" ? "bg-accent-50 text-accent-700" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <LayoutGrid size={15} />
            Kanban
          </button>
          <button
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${
              view === "list" ? "bg-accent-50 text-accent-700" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <ListIcon size={15} />
            List
          </button>
        </div>
      </div>

      {/* Content */}
      {applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications yet"
          description="Start tracking your job search by adding your first application."
          actionLabel="Add Application"
          onAction={() => setModalTarget("new")}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matches"
          description="Try a different search term or clear your filters."
        />
      ) : view === "kanban" ? (
        <KanbanBoard
          applications={filtered}
          onStatusChange={updateStatus}
          onDelete={handleDelete}
          onView={handleView}
          onEdit={(app) => setModalTarget(app)}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              layout="list"
              onStatusChange={updateStatus}
              onDelete={handleDelete}
              onView={handleView}
              onEdit={(a) => setModalTarget(a)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalTarget !== null}
        onClose={() => setModalTarget(null)}
        title={modalTarget === "new" ? "Add Application" : "Edit Application"}
        size="lg"
      >
        <ApplicationForm
          initialData={modalTarget === "new" ? null : modalTarget}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalTarget(null)}
        />
      </Modal>
    </div>
  );
}
