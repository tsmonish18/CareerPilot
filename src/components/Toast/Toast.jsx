// Pure presentational piece — ToastContext owns the state and timing,
// this just renders whatever list of toasts it's given.
export default function Toast({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 md:bottom-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onDismiss(t.id)}
          role="status"
          className={`animate-page-in cursor-pointer rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
            t.type === "error" ? "bg-rose-600 text-white" : "bg-slate-900 text-white"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
