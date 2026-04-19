import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ticketService from "../../services/ticketService";
import TicketStatusBadge from "../../components/tickets/TicketStatusBadge";
import TicketPriorityBadge from "../../components/tickets/TicketPriorityBadge";
import TicketAttachmentGallery from "../../components/tickets/TicketAttachmentGallery";
import TicketCommentSection from "../../components/tickets/TicketCommentSection";

function TicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [statusForm, setStatusForm] = useState({
    status: "",
    rejectionReason: "",
    resolutionNotes: "",
  });
  const [loading, setLoading] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const [ticketRes, attachmentRes, commentRes] = await Promise.all([
        ticketService.getById(id),
        ticketService.getAttachments(id),
        ticketService.getComments(id),
      ]);

      setTicket(ticketRes.data);
      setAttachments(Array.isArray(attachmentRes.data) ? attachmentRes.data : []);
      setComments(Array.isArray(commentRes.data) ? commentRes.data : []);
      setStatusForm((prev) => ({
        ...prev,
        status: ticketRes.data?.status || "",
      }));
    } catch (err) {
      console.error(err);
      setError("Failed to load ticket details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setCommentSubmitting(true);
      await ticketService.addComment(id, { commentText: newComment });
      setNewComment("");
      await loadDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusForm.status) return;

    try {
      setStatusSubmitting(true);
      await ticketService.updateStatus(id, {
        status: statusForm.status,
        rejectionReason: statusForm.rejectionReason || null,
        resolutionNotes: statusForm.resolutionNotes || null,
      });
      await loadDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setStatusSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-500">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-3xl bg-red-50 p-6 text-red-700 shadow-sm ring-1 ring-red-200">
          {error || "Ticket not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#2F80ED]">
              Ticket Details
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#123A7A]">
              {ticket.ticketNumber || `Ticket #${ticket.id}`}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/tickets")}
            className="rounded-full border border-[#123A7A] px-5 py-2 font-semibold text-[#123A7A] transition hover:bg-[#123A7A] hover:text-white"
          >
            Back to Tickets
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <TicketStatusBadge status={ticket.status} />
                <TicketPriorityBadge priority={ticket.priority} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-[#F5F8FC] p-4">
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="font-semibold text-[#123A7A]">
                    {ticket.category?.replaceAll("_", " ")}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F5F8FC] p-4">
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="font-semibold text-[#123A7A]">
                    {ticket.location || "Not specified"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F5F8FC] p-4">
                  <p className="text-sm text-slate-500">Resource ID</p>
                  <p className="font-semibold text-[#123A7A]">
                    {ticket.resourceId ?? "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F5F8FC] p-4">
                  <p className="text-sm text-slate-500">Assigned To</p>
                  <p className="font-semibold text-[#123A7A]">
                    {ticket.assignedToUserId ?? "Unassigned"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F5F8FC] p-4">
                  <p className="text-sm text-slate-500">Preferred Contact</p>
                  <p className="font-semibold text-[#123A7A]">
                    {ticket.preferredContact || "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F5F8FC] p-4">
                  <p className="text-sm text-slate-500">Created At</p>
                  <p className="font-semibold text-[#123A7A]">
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-[#F5F8FC] p-4">
                <p className="text-sm text-slate-500">Description</p>
                <p className="mt-2 leading-7 text-slate-700">
                  {ticket.description}
                </p>
              </div>

              {ticket.rejectionReason ? (
                <div className="mt-5 rounded-2xl bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">
                    Rejection Reason
                  </p>
                  <p className="mt-2 text-red-600">{ticket.rejectionReason}</p>
                </div>
              ) : null}

              {ticket.resolutionNotes ? (
                <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-700">
                    Resolution Notes
                  </p>
                  <p className="mt-2 text-emerald-700">
                    {ticket.resolutionNotes}
                  </p>
                </div>
              ) : null}
            </div>

            <TicketAttachmentGallery attachments={attachments} />

            <TicketCommentSection
              comments={comments}
              newComment={newComment}
              setNewComment={setNewComment}
              onAddComment={handleAddComment}
              submitting={commentSubmitting}
            />
          </div>

          <div>
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-4 text-xl font-bold text-[#123A7A]">
                Update Ticket Status
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                    Status
                  </label>
                  <select
                    value={statusForm.status}
                    onChange={(e) =>
                      setStatusForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2F80ED]"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                    Resolution Notes
                  </label>
                  <textarea
                    rows={4}
                    value={statusForm.resolutionNotes}
                    onChange={(e) =>
                      setStatusForm((prev) => ({
                        ...prev,
                        resolutionNotes: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2F80ED]"
                    placeholder="Add resolution notes if resolved..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                    Rejection Reason
                  </label>
                  <textarea
                    rows={4}
                    value={statusForm.rejectionReason}
                    onChange={(e) =>
                      setStatusForm((prev) => ({
                        ...prev,
                        rejectionReason: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2F80ED]"
                    placeholder="Add rejection reason if rejected..."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleStatusUpdate}
                  disabled={statusSubmitting}
                  className="w-full rounded-full bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {statusSubmitting ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailsPage;