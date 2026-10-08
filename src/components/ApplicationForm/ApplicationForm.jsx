import { useState } from "react";
import { STATUS_ORDER } from "../../utils/statusStyles.js";
import { validateApplication } from "../../utils/helpers.js";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Converts a stored application (skills as an array) into form state (skills
// as a comma-separated string) and back again on submit.
function toFormValues(app) {
  return {
    company: app?.company ?? "",
    role: app?.role ?? "",
    location: app?.location ?? "",
    jobType: app?.jobType ?? JOB_TYPES[0],
    appliedDate: app?.appliedDate ?? todayISO(),
    status: app?.status ?? STATUS_ORDER[0],
    jobUrl: app?.jobUrl ?? "",
    salary: app?.salary ?? "",
    jobDescription: app?.jobDescription ?? "",
    skills: app?.skills?.join(", ") ?? "",
    interviewDate: app?.interviewDate ? app.interviewDate.slice(0, 16) : "",
    followUpDate: app?.followUpDate ?? "",
    notes: app?.notes ?? "",
  };
}

function Field({ label, error, required, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-100";

export default function ApplicationForm({ initialData, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => toFormValues(initialData));
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateApplication(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      ...values,
      skills: values.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Company Name" required error={errors.company}>
          <input
            className={inputClass}
            value={values.company}
            onChange={update("company")}
            placeholder="e.g. TechNova"
            autoFocus
          />
        </Field>
        <Field label="Job Role" required error={errors.role}>
          <input
            className={inputClass}
            value={values.role}
            onChange={update("role")}
            placeholder="e.g. Frontend Developer"
          />
        </Field>
        <Field label="Location" required error={errors.location}>
          <input
            className={inputClass}
            value={values.location}
            onChange={update("location")}
            placeholder="e.g. Chennai or Remote"
          />
        </Field>
        <Field label="Job Type" required>
          <select className={inputClass} value={values.jobType} onChange={update("jobType")}>
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Application Date" required error={errors.appliedDate}>
          <input
            type="date"
            className={inputClass}
            value={values.appliedDate}
            onChange={update("appliedDate")}
          />
        </Field>
        <Field label="Application Status" required>
          <select className={inputClass} value={values.status} onChange={update("status")}>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Job URL" error={errors.jobUrl}>
          <input
            className={inputClass}
            value={values.jobUrl}
            onChange={update("jobUrl")}
            placeholder="https://company.com/careers/123"
          />
        </Field>
        <Field label="Salary Range">
          <input
            className={inputClass}
            value={values.salary}
            onChange={update("salary")}
            placeholder="e.g. ₹8–12 LPA"
          />
        </Field>
      </div>

      <Field label="Required Skills">
        <input
          className={inputClass}
          value={values.skills}
          onChange={update("skills")}
          placeholder="React, JavaScript, TypeScript (comma-separated)"
        />
      </Field>

      <Field label="Job Description">
        <textarea
          className={`${inputClass} min-h-[90px] resize-y`}
          value={values.jobDescription}
          onChange={update("jobDescription")}
          placeholder="Paste the job description here..."
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Interview Date" error={errors.interviewDate}>
          <input
            type="datetime-local"
            className={inputClass}
            value={values.interviewDate}
            onChange={update("interviewDate")}
          />
        </Field>
        <Field label="Follow-up Date">
          <input
            type="date"
            className={inputClass}
            value={values.followUpDate}
            onChange={update("followUpDate")}
          />
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          className={`${inputClass} min-h-[70px] resize-y`}
          value={values.notes}
          onChange={update("notes")}
          placeholder="Any personal notes about this application..."
        />
      </Field>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-700"
        >
          Save Application
        </button>
      </div>
    </form>
  );
}
