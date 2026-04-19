import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TicketCard from "../../components/tickets/TicketCard";
import TicketFilters from "../../components/tickets/TicketFilters";
import ticketService from "../../services/ticketService";

function TicketListPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("my");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  const fetchTickets = async () => {
    setLoading(true);
    setError("");

    try {
      const res =
        viewMode === "my"
          ? await ticketService.getMyTickets()
          : await ticketService.getAll();
      setTickets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load tickets.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [viewMode]);

  const filteredTickets = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        !term ||
        ticket.ticketNumber?.toLowerCase().includes(term) ||
        ticket.category?.toLowerCase().includes(term) ||
        ticket.location?.toLowerCase().includes(term) ||
        ticket.description?.toLowerCase().includes(term);

      const matchesStatus =
        !filters.status || ticket.status === filters.status;

      const matchesPriority =
        !filters.priority || ticket.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, filters.priority, filters.status]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({ status: "", priority: "" });
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#2F80ED]">
              Maintenance Module
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#123A7A]">
              Incident Tickets
            </h1>
            <p className="mt-2 text-slate-600">
              Track reported issues, monitor progress, and manage maintenance
              workflows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode("my")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  viewMode === "my"
                    ? "bg-[#123A7A] text-white"
                    : "text-slate-600"
                }`}
              >
                My Tickets
              </button>
              <button
                type="button"
                onClick={() => setViewMode("all")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  viewMode === "all"
                    ? "bg-[#123A7A] text-white"
                    : "text-slate-600"
                }`}
              >
                All Tickets
              </button>
            </div>

            <Link
              to="/tickets/new"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02]"
            >
              + Create Ticket
            </Link>
          </div>
        </div>

        <TicketFilters
          filters={filters}
          onChange={handleFilterChange}
          onSearchChange={setSearchTerm}
          searchTerm={searchTerm}
          onReset={handleReset}
        />

        <div className="mt-6">
          {loading ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-slate-500">Loading tickets...</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl bg-red-50 p-6 text-red-700 shadow-sm ring-1 ring-red-200">
              {error}
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-bold text-[#123A7A]">
                No Tickets Found
              </h2>
              <p className="mt-2 text-slate-500">
                Try changing filters or create a new ticket.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {filteredTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketListPage;
