import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Applications from "./pages/Applications.jsx";
import ApplicationDetails from "./pages/ApplicationDetails.jsx";
import AIAnalyzer from "./pages/AIAnalyzer.jsx";
import InterviewPrep from "./pages/InterviewPrep.jsx";
import FollowUps from "./pages/FollowUps.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return <Routes><Route path="/" element={<Layout />}><Route index element={<Navigate to="/dashboard" replace />} /><Route path="dashboard" element={<Dashboard />} /><Route path="applications" element={<Applications />} /><Route path="applications/:id" element={<ApplicationDetails />} /><Route path="ai-analyzer" element={<AIAnalyzer />} /><Route path="interview-prep" element={<InterviewPrep />} /><Route path="follow-ups" element={<FollowUps />} /><Route path="analytics" element={<Analytics />} /><Route path="settings" element={<Settings />} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Route></Routes>;
}
