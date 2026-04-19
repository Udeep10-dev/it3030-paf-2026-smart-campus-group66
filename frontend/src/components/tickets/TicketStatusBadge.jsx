function TicketStatusBadge({ status }) {
  const normalized = (status || "").toUpperCase();

  const styles = {
    OPEN: "bg-amber-100 text-amber-700 border border-amber-200",
    IN_PROGRESS: "bg-blue-100 text-blue-700 border border-blue-200",
    RESOLVED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    CLOSED: "bg-slate-100 text-slate-700 border border-slate-200",
    REJECTED: "bg-red-100 text-red-700 border border-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[normalized] || "bg-slate-100 text-slate-700 border border-slate-200"
      }`}
    >
      {normalized.replaceAll("_", " ") || "UNKNOWN"}
    </span>
  );
}

export default TicketStatusBadge;