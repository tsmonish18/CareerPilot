import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { demoApplications } from "../data/demoData.js";
import { generateId, computeNextAction } from "../utils/helpers.js";
import { storage } from "../utils/storage.js";

const ApplicationsContext = createContext(null);

export function ApplicationsProvider({ children }) {
  const [applications, setApplications] = useState(() => storage.getApplications(demoApplications));

  useEffect(() => { storage.saveApplications(applications); }, [applications]);

  const addApplication = useCallback((values) => {
    const newApp = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...values,
      nextAction: computeNextAction(values),
    };
    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  }, []);

  const updateApplication = useCallback((id, values) => {
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, ...values, nextAction: values.nextAction ?? computeNextAction({ ...a, ...values }) } : a));
  }, []);

  const updateStatus = useCallback((id, status) => {
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status, nextAction: computeNextAction({ ...a, status }) } : a));
  }, []);

  const deleteApplication = useCallback((id) => setApplications((prev) => prev.filter((a) => a.id !== id)), []);
  const resetApplications = useCallback(() => setApplications(demoApplications), []);
  const getApplication = useCallback((id) => applications.find((a) => a.id === id), [applications]);

  return <ApplicationsContext.Provider value={{ applications, addApplication, updateApplication, updateStatus, deleteApplication, resetApplications, getApplication }}>
    {children}
  </ApplicationsContext.Provider>;
}

export function useApplications() {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) throw new Error("useApplications must be used within an ApplicationsProvider");
  return ctx;
}
