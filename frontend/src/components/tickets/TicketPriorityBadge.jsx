function TicketPriorityBadge({ priority }) {
  const normalized = (priority || "").toUpperCase();

  const styles = {
    LOW: "bg-slate-100 text-slate-700 border border-slate-200",
    MEDIUM: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    HIGH: "bg-orange-100 text-orange-700 border border-orange-200",
    URGENT: "bg-red-100 text-red-700 border border-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[normalized] || "bg-slate-100 text-slate-700 border border-slate-200"
      }`}
    >
      {normalized || "N/A"}
    </span>
  );
}

export default TicketPriorityBadge;
