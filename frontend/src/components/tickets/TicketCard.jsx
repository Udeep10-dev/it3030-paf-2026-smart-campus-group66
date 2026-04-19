import { Link } from "react-router-dom";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketPriorityBadge from "./TicketPriorityBadge";

function TicketCard({ ticket }) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2F80ED]">
            {ticket.ticketNumber || `Ticket #${ticket.id}`}
          </p>
          <h3 className="mt-1 text-xl font-bold text-[#123A7A]">
            {ticket.category?.replaceAll("_", " ") || "General Ticket"}
          </h3>
        </div>

        <TicketStatusBadge status={ticket.status} />
      </div>

      <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-600">
        {ticket.description}
      </p>

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-[#F5F8FC] p-3">
          <p className="text-slate-500">Location</p>
          <p className="font-semibold text-[#123A7A]">
            {ticket.location || "Not specified"}
          </p>
        </div>

        <div className="rounded-2xl bg-[#F5F8FC] p-3">
          <p className="text-slate-500">Resource ID</p>
          <p className="font-semibold text-[#123A7A]">
            {ticket.resourceId ?? "N/A"}
          </p>
        </div>

        <div className="rounded-2xl bg-[#F5F8FC] p-3">
          <p className="text-slate-500">Assigned To</p>
          <p className="font-semibold text-[#123A7A]">
            {ticket.assignedToUserId ?? "Unassigned"}
          </p>
        </div>

        <div className="rounded-2xl bg-[#F5F8FC] p-3">
          <p className="text-slate-500">Created</p>
          <p className="font-semibold text-[#123A7A]">
            {ticket.createdAt
              ? new Date(ticket.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <TicketPriorityBadge priority={ticket.priority} />
        <span className="text-xs text-slate-500">
          Reporter: {ticket.reportedByUserId ?? "N/A"}
        </span>
      </div>

      <div className="flex justify-end">
        <Link
          to={`/tickets/${ticket.id}`}
          className="rounded-full bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02]"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default TicketCard;