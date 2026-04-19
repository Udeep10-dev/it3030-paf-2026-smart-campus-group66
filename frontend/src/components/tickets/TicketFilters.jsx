function TicketFilters({
  filters,
  onChange,
  onSearchChange,
  searchTerm,
  onReset,
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#123A7A]">
            Search
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by category, location..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2F80ED]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#123A7A]">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onChange("status", e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2F80ED]"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#123A7A]">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => onChange("priority", e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2F80ED]"
          >
            <option value="">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            className="w-full rounded-2xl border border-[#123A7A] px-4 py-3 font-semibold text-[#123A7A] transition hover:bg-[#123A7A] hover:text-white"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketFilters;
