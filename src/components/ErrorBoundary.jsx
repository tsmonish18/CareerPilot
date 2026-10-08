import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error("CareerPilot UI error:", error); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"><h1 className="text-xl font-bold text-slate-900">Something went wrong</h1><p className="mt-2 text-sm leading-6 text-slate-500">CareerPilot hit an unexpected UI error. Reload the page to continue.</p><button onClick={()=>window.location.reload()} className="mt-5 rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-700">Reload CareerPilot</button></div></div>;
  }
}
