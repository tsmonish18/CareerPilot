import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  MapPin,
  Briefcase,
  Clock3,
  Pencil,
  Trash2,
  FileText,
  CircleCheck,
  StickyNote,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge/StatusBadge.jsx";
import Modal from "../components/Modal/Modal.jsx";
import ApplicationForm from "../components/ApplicationForm/ApplicationForm.jsx";
import { useApplications } from "../context/ApplicationsContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { STATUS_BADGE } from "../utils/statusStyles.js";

function formatDate(dateStr, includeTime = false) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(includeTime ? { hour: "numeric", minute: "2-digit" } : {}),
  };
  return date.toLocaleDateString("en-US", options);
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-0.5 break-words text-sm font-medium text-slate-800">{value || "—"}</p>
      </div>
    </div>
  );
}

function TimelineItem({ title, date, description, done = false }) {
  return (
    <div className="relative flex gap-3">
      <div className="relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
        {done ? (
          <CircleCheck size={15} className="text-emerald-500" />
        ) : (
          <div className="h-2 w-2 rounded-full bg-slate-300" />
        )}
      </div>
      <div className="pb-5">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{date}</p>
        {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
      </div>
    </div>
  );
}

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, updateApplication, deleteApplication } = useApplications();
  const { showToast } = useToast();

  const application = applications.find((app) => app.id === id);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!application) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
          <Briefcase size={24} className="text-slate-400" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-slate-900">Application not found</h1>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          This application may have been deleted or the link is no longer valid.
        </p>
        <button
          onClick={() => navigate("/applications")}
          className="mt-5 rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-700"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  const handleEdit = (values) => {
    updateApplication(application.id, values);
    setIsEditOpen(false);
    showToast(`Updated your application to ${values.company}.`);
  };

  const handleDelete = () => {
    if (window.confirm(`Remove your application to ${application.company}? This can't be undone.`)) {
      deleteApplication(application.id);
      showToast(`Removed ${application.company} from your tracker.`);
      navigate("/applications");
    }
  };

  const skills = application.skills ?? [];
  const hasInterview = Boolean(application.interviewDate);
  const hasFollowUp = Boolean(application.followUpDate);

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/applications")}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Applications
      </button>

      {/* Hero */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-lg font-bold text-accent-700">
              {application.company[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {application.role}
                </h1>
                <StatusBadge status={application.status} />
              </div>
              <p className="mt-1 text-base font-medium text-slate-600">{application.company}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} />
                  {application.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase size={14} />
                  {application.jobType}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  Applied {formatDate(application.appliedDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            {application.jobUrl && (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ExternalLink size={15} />
                Job Listing
              </a>
            )}
            <button
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Pencil size={15} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              aria-label="Delete application"
              className="inline-flex items-center justify-center rounded-xl border border-rose-100 px-3 py-2 text-rose-600 hover:bg-rose-50"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {application.nextAction && (
          <div className={`mt-5 rounded-xl border px-4 py-3 ${STATUS_BADGE[application.status] ?? "border-slate-200 bg-slate-50 text-slate-700"}`}>
            <div className="flex items-center gap-2">
              <Clock3 size={15} />
              <span className="text-sm font-semibold">Next action</span>
            </div>
            <p className="mt-1 text-sm">{application.nextAction}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main information */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-accent-600" />
              <h2 className="text-base font-semibold text-slate-900">Application Details</h2>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem icon={Briefcase} label="Job Type" value={application.jobType} />
              <DetailItem icon={CalendarDays} label="Applied Date" value={formatDate(application.appliedDate)} />
              <DetailItem icon={MapPin} label="Location" value={application.location} />
              <DetailItem icon={Clock3} label="Salary Range" value={application.salary} />
            </div>

            {skills.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-medium text-slate-400">Required Skills</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {application.jobDescription && (
              <div className="mt-5">
                <p className="text-xs font-medium text-slate-400">Job Description</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {application.jobDescription}
                </p>
              </div>
            )}
          </section>

          {/* Timeline */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-slate-900">Application Timeline</h2>
            <div className="relative mt-5">
              <div className="absolute bottom-5 left-3.5 top-2 w-px bg-slate-200" />
              <TimelineItem
                title="Application submitted"
                date={formatDate(application.appliedDate)}
                description={`Applied for ${application.role} at ${application.company}.`}
                done
              />
              {hasFollowUp && (
                <TimelineItem
                  title="Follow-up"
                  date={formatDate(application.followUpDate)}
                  description="Scheduled follow-up date."
                  done={new Date(application.followUpDate) <= new Date()}
                />
              )}
              {hasInterview && (
                <TimelineItem
                  title="Interview"
                  date={formatDate(application.interviewDate, true)}
                  description={
                    application.prepProgress != null
                      ? `Interview preparation is ${application.prepProgress}% complete.`
                      : "Interview scheduled."
                  }
                  done={new Date(application.interviewDate) <= new Date()}
                />
              )}
              <TimelineItem
                title={`Current status: ${application.status}`}
                date="Current"
                description={application.nextAction}
                done={application.status !== "Applied"}
              />
            </div>
          </section>
        </div>

        {/* Sidebar information */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Interview Preparation</h2>
              <span className="text-sm font-bold text-accent-600">{application.prepProgress ?? 0}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-accent-600 transition-all"
                style={{ width: `${Math.min(Math.max(application.prepProgress ?? 0, 0), 100)}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              {hasInterview
                ? `Interview: ${formatDate(application.interviewDate, true)}`
                : "No interview has been scheduled yet."}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <StickyNote size={17} className="text-amber-500" />
              <h2 className="text-base font-semibold text-slate-900">Notes</h2>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {application.notes || "No notes added for this application."}
            </p>
          </section>

          {application.jobUrl && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-slate-400">Job URL</p>
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block truncate text-sm font-medium text-accent-600 hover:text-accent-700"
              >
                {application.jobUrl}
              </a>
            </section>
          )}
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Application"
        size="lg"
      >
        <ApplicationForm
          initialData={application}
          onSubmit={handleEdit}
          onCancel={() => setIsEditOpen(false)}
        />
      </Modal>
    </div>
  );
}
