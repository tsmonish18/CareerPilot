import { useState } from "react";
import { FileSearch, Sparkles, RotateCcw, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyzeJobDescription } from "../utils/aiAnalyzer.js";
import AnalysisResult from "../components/AIAnalyzer/AnalysisResult.jsx";
import Modal from "../components/Modal/Modal.jsx";
import ApplicationForm from "../components/ApplicationForm/ApplicationForm.jsx";
import { useApplications } from "../context/ApplicationsContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const SAMPLE_JD = `We are looking for a Frontend Developer to build responsive web applications using React, JavaScript, TypeScript, HTML and CSS. You will work with REST APIs, Git and Node.js in a collaborative engineering team. 2+ years of experience with modern frontend development is preferred. Experience with Redux is a plus. Strong communication and problem solving skills are important.`;

export default function AIAnalyzer() {
  const navigate = useNavigate();
  const { addApplication } = useApplications();
  const { showToast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);

  const handleAnalyze = () => {
    const trimmed = jobDescription.trim();
    if (!trimmed) return;
    setResult(analyzeJobDescription(trimmed));
  };

  const handleLoadSample = () => {
    setJobDescription(SAMPLE_JD);
    setResult(null);
  };

  const handleReset = () => {
    setJobDescription("");
    setResult(null);
  };

  const handleSave = (values) => {
    setIsSaving(true);
    const application = addApplication({
      ...values,
      jobDescription,
      skills: values.skills?.length ? values.skills : result?.requiredSkills || [],
    });
    setIsSaving(false);
    setIsSaveOpen(false);
    showToast(`Saved ${application.role} at ${application.company} to your tracker.`);
    navigate(`/applications/${application.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
            <Sparkles size={14} /> AI Job Analyzer
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Understand your fit before you apply.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Paste a job description and CareerPilot will compare it with your demo profile, surface skill gaps, extract keywords, and prepare it for your application tracker.
          </p>
        </div>
        <button
          onClick={handleReset}
          disabled={!jobDescription && !result}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={15} /> Reset
        </button>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileSearch size={18} className="text-accent-600" />
            <h2 className="text-base font-semibold text-slate-900">Job description</h2>
          </div>
          <button onClick={handleLoadSample} className="text-xs font-semibold text-accent-600 hover:text-accent-700">Load demo JD</button>
        </div>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the complete job description here..."
          className="mt-4 min-h-[240px] w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700 placeholder:text-slate-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-100"
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">{jobDescription.trim().length} characters</p>
          <button
            onClick={handleAnalyze}
            disabled={!jobDescription.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles size={16} /> Analyze Job <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {result ? (
        <AnalysisResult result={result} onSave={() => setIsSaveOpen(true)} />
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
            <Sparkles size={25} />
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-900">Your analysis will appear here</h2>
          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">Paste a job description above and click Analyze Job to see the match score, skills, keywords, alignment and suggestions.</p>
        </section>
      )}

      <Modal isOpen={isSaveOpen} onClose={() => !isSaving && setIsSaveOpen(false)} title="Save Analyzed Job" size="lg">
        <ApplicationForm
          initialData={{
            company: "",
            role: result?.role || "",
            location: "",
            jobType: "Full-time",
            appliedDate: new Date().toISOString().slice(0, 10),
            status: "Applied",
            jobDescription,
            skills: result?.requiredSkills || [],
          }}
          onSubmit={handleSave}
          onCancel={() => setIsSaveOpen(false)}
        />
      </Modal>
    </div>
  );
}
