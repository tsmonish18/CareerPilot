import {
  CheckCircle2,
  CircleAlert,
  Code2,
  Gauge,
  Lightbulb,
  Target,
  UserRound,
} from "lucide-react";

function Section({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-accent-600" />
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SkillPill({ children, positive = false, warning = false }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        positive
          ? "bg-emerald-50 text-emerald-700"
          : warning
            ? "bg-amber-50 text-amber-700"
            : "bg-slate-100 text-slate-600"
      }`}
    >
      {children}
    </span>
  );
}

export default function AnalysisResult({ result, onSave }) {
  const scoreRing = result.matchPercentage >= 75 ? "text-emerald-600" : result.matchPercentage >= 50 ? "text-amber-600" : "text-rose-600";

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">AI analysis</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Your job match</h2>
            <p className="mt-1 text-sm text-slate-500">A demo profile-based analysis using the skills in CareerPilot.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-slate-100">
              <span className={`text-2xl font-extrabold ${scoreRing}`}>{result.matchPercentage}%</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Match score</p>
              <p className="mt-1 text-xs text-slate-500">Based on skills, role and experience</p>
            </div>
          </div>
        </div>
        <button
          onClick={onSave}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-700 sm:w-auto"
        >
          Save as Application
        </button>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section icon={Code2} title="Matched skills">
          <div className="flex flex-wrap gap-2">
            {result.matchedSkills.length ? result.matchedSkills.map((skill) => <SkillPill key={skill} positive>{skill}</SkillPill>) : <p className="text-sm text-slate-500">No profile skills matched the detected requirements.</p>}
          </div>
        </Section>

        <Section icon={CircleAlert} title="Missing skills">
          <div className="flex flex-wrap gap-2">
            {result.missingSkills.length ? result.missingSkills.map((skill) => <SkillPill key={skill} warning>{skill}</SkillPill>) : <p className="text-sm text-emerald-600">No detected skill gaps.</p>}
          </div>
        </Section>
      </div>

      <Section icon={Target} title="Role & experience alignment">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-400">Detected role</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{result.role || "Not detected"}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-400">Experience</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {result.experienceRequired ? `${result.experienceRequired}+ years required` : "Not specified"}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-400">Profile</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">3+ years design experience</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{result.alignment}</p>
      </Section>

      <Section icon={Gauge} title="Important keywords">
        <div className="flex flex-wrap gap-2">
          {result.keywords.map((keyword) => <SkillPill key={keyword}>{keyword}</SkillPill>)}
        </div>
      </Section>

      <Section icon={Lightbulb} title="Improvement suggestions">
        <div className="space-y-3">
          {result.suggestions.map((suggestion, index) => (
            <div key={index} className="flex gap-3 rounded-xl bg-amber-50/70 p-3">
              <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-sm leading-6 text-slate-700">{suggestion}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-800">
        <div className="flex gap-2">
          <UserRound size={16} className="mt-0.5 shrink-0" />
          <p><strong>Demo mode:</strong> this analyzer runs locally with rule-based matching. The analyzer function is isolated so it can be replaced later with a real AI API without changing the page or tracker integration.</p>
        </div>
      </div>
    </div>
  );
}
