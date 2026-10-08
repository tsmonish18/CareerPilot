import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Briefcase, Star, MessageSquareText, Trophy, TrendingUp, Sparkles } from "lucide-react";
import StatCard from "../components/StatCard/StatCard.jsx";
import Modal from "../components/Modal/Modal.jsx";
import ApplicationForm from "../components/ApplicationForm/ApplicationForm.jsx";
import { demoProfile } from "../data/demoData.js";
import { useApplications } from "../context/ApplicationsContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { STATUS_ORDER, STATUS_COLOR, STATUS_BADGE } from "../utils/statusStyles.js";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function daysAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// Renders "Today", "Tomorrow", or "in N days" relative to now — used for
// interview/follow-up dates so the copy stays accurate as time passes.
function relativeDayLabel(dateStr) {
  const target = new Date(dateStr);
  const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const diffDays = Math.round((startOfTarget - startOfToday) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `in ${diffDays} days`;
  return "Overdue";
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { applications: demoApplications, addApplication } = useApplications();
  const { showToast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleAddSubmit = (values) => {
    addApplication(values);
    showToast(`Added your application to ${values.company}.`);
    setIsAddOpen(false);
  };

  const total = demoApplications.length;
  const shortlisted = demoApplications.filter((a) => a.status === "Shortlisted").length;
  const interviews = demoApplications.filter((a) => a.status === "Interview").length;
  const offers = demoApplications.filter((a) => a.status === "Offer").length;
  const responded = demoApplications.filter((a) => a.status !== "Applied").length;
  const responseRate = Math.round((responded / total) * 100);

  // Simple "this week" deltas — a light-touch trend indicator per stat card.
  const appsThisWeek = demoApplications.filter((a) => daysAgo(a.appliedDate) <= 7).length;
  const interviewsUpcoming = demoApplications.filter(
    (a) => a.interviewDate && new Date(a.interviewDate) > new Date()
  ).length;

  const statusCounts = STATUS_ORDER.map((status) => ({
    status,
    count: demoApplications.filter((a) => a.status === status).length,
  }));
  const maxCount = Math.max(...statusCounts.map((s) => s.count), 1);

  const recent = [...demoApplications]
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .slice(0, 3);

  const upcomingInterview = [...demoApplications]
    .filter((a) => a.interviewDate)
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))[0];
  const upcomingFollowUp = [...demoApplications]
    .filter((a) => a.followUpDate)
    .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate))[0];
  const incompletePrep = demoApplications.find((a) => a.status === "Applied");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {getGreeting()}, {demoProfile.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here's your job search overview.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-700 sm:self-auto"
        >
          <Plus size={16} />
          Add Application
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Total Applications"
          value={total}
          icon={Briefcase}
          accent="indigo"
          trend={appsThisWeek > 0 ? `+${appsThisWeek} this week` : undefined}
        />
        <StatCard label="Shortlisted" value={shortlisted} icon={Star} accent="amber" />
        <StatCard
          label="Interviews"
          value={interviews}
          icon={MessageSquareText}
          accent="indigo"
          trend={interviewsUpcoming > 0 ? `${interviewsUpcoming} upcoming` : undefined}
        />
        <StatCard label="Offers" value={offers} icon={Trophy} accent="green" trend={offers > 0 ? "🎉 Keep going" : undefined} />
        <StatCard label="Response Rate" value={`${responseRate}%`} icon={TrendingUp} accent="green" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Application overview chart */}
        <div className="card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">Application Overview</h2>
          <div className="mt-5 space-y-3">
            {statusCounts.map(({ status, count }) => (
              <div key={status} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm text-slate-600">{status}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${STATUS_COLOR[status]}`}
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-sm font-semibold text-slate-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight card */}
        <div className="card rounded-2xl border border-accent-100 bg-gradient-to-br from-accent-50 to-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-accent-700">
            <Sparkles size={18} />
            <h2 className="text-sm font-semibold">Your next best action</h2>
          </div>
          {upcomingInterview ? (
            <>
              <p className="mt-3 text-sm font-medium text-slate-900">
                Prepare for your upcoming {upcomingInterview.company} interview.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Your interview is {relativeDayLabel(upcomingInterview.interviewDate).toLowerCase()} and your
                preparation progress is currently {upcomingInterview.prepProgress ?? 0}%.
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              No urgent action right now — keep applying to build momentum.
            </p>
          )}
          <button onClick={() => navigate(`/interview-prep?application=${upcomingInterview?.id || ""}`)} className="mt-4 text-sm font-semibold text-accent-600 hover:text-accent-700">
            Start Preparation →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent applications */}
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Recent Applications</h2>
          <div className="space-y-3">
            {recent.map((app) => (
              <button
                key={app.id}
                onClick={() => navigate(`/applications/${app.id}`)}
                className="card flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-accent-200 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700">
                    {app.company[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{app.company}</p>
                    <p className="text-xs text-slate-500">{app.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[app.status]}`}>
                    {app.status}
                  </span>
                  <p className="mt-1 text-xs text-slate-400">Applied {formatDate(app.appliedDate)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming actions */}
        <div>
          <h2 className="mb-3 text-base font-semibold text-slate-900">Upcoming Actions</h2>
          <div className="space-y-3">
            {upcomingInterview && (
              <div className="card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">Interview</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{upcomingInterview.role}</p>
                <p className="text-xs text-slate-500">
                  {upcomingInterview.company} · {relativeDayLabel(upcomingInterview.interviewDate)}
                  , {formatTime(upcomingInterview.interviewDate)}
                </p>
              </div>
            )}
            {upcomingFollowUp && (
              <div className="card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Follow-up</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{upcomingFollowUp.role}</p>
                <p className="text-xs text-slate-500">
                  {upcomingFollowUp.company} · Follow up {relativeDayLabel(upcomingFollowUp.followUpDate).toLowerCase()}
                </p>
              </div>
            )}
            {incompletePrep && (
              <div className="card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Interview Preparation</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{incompletePrep.role}</p>
                <p className="text-xs text-slate-500">{incompletePrep.company} · Preparation incomplete</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Application"
        size="lg"
      >
        <ApplicationForm onSubmit={handleAddSubmit} onCancel={() => setIsAddOpen(false)} />
      </Modal>
    </div>
  );
}
