import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ticketService from "../../services/ticketService";
import userService from "../../services/userService";
import TicketStatusBadge from "../../components/tickets/TicketStatusBadge";
import TicketPriorityBadge from "../../components/tickets/TicketPriorityBadge";
import TicketAttachmentGallery from "../../components/tickets/TicketAttachmentGallery";
import TicketCommentSection from "../../components/tickets/TicketCommentSection";
import {
  MAX_TICKET_ATTACHMENTS,
  validateAssignForm,
  validateAttachmentFiles,
  validateCommentText,
  validateStatusForm,
} from "../../utils/ticketFormValidation";
import { getNextTicketStatuses } from "../../utils/ticketTransitions";

function TicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentUserId = user?.id ?? null;
  const currentUserRole = user?.role?.toUpperCase?.() || "";
  const isStaff = currentUserRole === "STAFF";
  const isAdmin = currentUserRole === "ADMIN";
  const canAssignTicket = isStaff || isAdmin;

  const [ticket, setTicket] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [assignForm, setAssignForm] = useState({
    assignedToUserId: "",
  });
  const [statusForm, setStatusForm] = useState({
    status: "",
    rejectionReason: "",
    resolutionNotes: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentActionId, setCommentActionId] = useState(null);
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [uploadSubmitting, setUploadSubmitting] = useState(false);
  const [attachmentActionId, setAttachmentActionId] = useState(null);
  const [uploadInputKey, setUploadInputKey] = useState(0);
  const [error, setError] = useState("");
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [commentError, setCommentError] = useState("");
  const [assignErrors, setAssignErrors] = useState({
    assignedToUserId: "",
  });
  const [statusErrors, setStatusErrors] = useState({
    status: "",
    rejectionReason: "",
    resolutionNotes: "",
  });
  const [attachmentError, setAttachmentError] = useState("");

  const loadDetails = async ({ showSpinner = true } = {}) => {
    if (showSpinner) {
      setLoading(true);
    }

    try {
      const [ticketRes, attachmentRes, commentRes] = await Promise.all([
        ticketService.getById(id),
        ticketService.getAttachments(id),
        ticketService.getComments(id),
      ]);

      setTicket(ticketRes.data);
      setAttachments(Array.isArray(attachmentRes.data) ? attachmentRes.data : []);
      setComments(Array.isArray(commentRes.data) ? commentRes.data : []);
      setAssignForm({
        assignedToUserId: ticketRes.data?.assignedToUserId
          ? String(ticketRes.data.assignedToUserId)
          : "",
      });
      setStatusForm({
        status: "",
        rejectionReason: "",
        resolutionNotes: "",
      });
      setAttachmentError("");
      setError("");
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message || "Failed to load ticket details.";
      setError(message);
      toast.error(message);
    } finally {
      if (showSpinner) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  useEffect(() => {
    if (!canAssignTicket) {
      setAssignableUsers([]);
      return;
    }

    const loadAssignableUsers = async () => {
      try {
        const res = await userService.getAssignableUsers();
        setAssignableUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        toast.error(
          err?.response?.data?.message || "Failed to load assignable users."
        );
      }
    };

    loadAssignableUsers();
  }, [canAssignTicket]);

  const transitionOptions = getNextTicketStatuses(ticket?.status, currentUserRole);
  const remainingAttachmentSlots = Math.max(
    MAX_TICKET_ATTACHMENTS - attachments.length,
    0
  );
  const canUploadAttachments =
    isAdmin || isStaff || ticket?.reportedByUserId === currentUserId;
  const canManageStatus =
    isAdmin || (isStaff && ticket?.assignedToUserId === currentUserId);

  const handleAddComment = async () => {
    const nextCommentError = validateCommentText(newComment);
    if (nextCommentError) {
      setCommentError(nextCommentError);
      toast.error(nextCommentError);
      return;
    }

    try {
      setCommentSubmitting(true);
      await ticketService.addComment(id, { commentText: newComment.trim() });
      setNewComment("");
      setCommentError("");
      toast.success("Comment added successfully.");
      await loadDetails({ showSpinner: false });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add comment.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId, commentText) => {
    const nextCommentError = validateCommentText(commentText, "Edited comment");
    if (nextCommentError) {
      toast.error(nextCommentError);
      return false;
    }

    try {
      setCommentActionId(commentId);
      await ticketService.updateComment(commentId, { commentText });
      toast.success("Comment updated successfully.");
      await loadDetails({ showSpinner: false });
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update comment.");
      return false;
    } finally {
      setCommentActionId(null);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) return;

    try {
      setCommentActionId(commentId);
      await ticketService.deleteComment(commentId);
      toast.success("Comment deleted successfully.");
      await loadDetails({ showSpinner: false });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete comment.");
    } finally {
      setCommentActionId(null);
    }
  };

  const handleAssignTicket = async () => {
    const assignedToUserIdError = validateAssignForm(assignForm.assignedToUserId);
    if (assignedToUserIdError) {
      setAssignErrors({ assignedToUserId: assignedToUserIdError });
      toast.error(assignedToUserIdError);
      return;
    }

    try {
      setAssignSubmitting(true);
      setAssignErrors({ assignedToUserId: "" });
      await ticketService.assignTicket(id, {
        assignedToUserId: Number(assignForm.assignedToUserId),
      });
      toast.success("Ticket assigned successfully.");
      await loadDetails({ showSpinner: false });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to assign ticket.");
    } finally {
      setAssignSubmitting(false);
    }
  };

  const handleStatusUpdate = async () => {
    const nextStatusErrors = validateStatusForm(statusForm);
    if (Object.values(nextStatusErrors).some(Boolean)) {
      setStatusErrors((prev) => ({ ...prev, ...nextStatusErrors }));
      toast.error("Please fix the status form before updating.");
      return;
    }

    try {
      setStatusSubmitting(true);
      setStatusErrors({
        status: "",
        rejectionReason: "",
        resolutionNotes: "",
      });
      await ticketService.updateStatus(id, {
        status: statusForm.status,
        rejectionReason:
          statusForm.status === "REJECTED"
            ? statusForm.rejectionReason.trim()
            : null,
        resolutionNotes:
          statusForm.status === "RESOLVED"
            ? statusForm.resolutionNotes.trim()
            : null,
      });
      setStatusForm({
        status: "",
        rejectionReason: "",
        resolutionNotes: "",
      });
      toast.success("Ticket status updated.");
      await loadDetails({ showSpinner: false });
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.status === 401
          ? "Status update was rejected with 401 Unauthorized. Your login may still be active, but the backend did not accept this admin request."
          : err?.response?.data?.message || "Failed to update status."
      );
    } finally {
      setStatusSubmitting(false);
    }
  };

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files || []);
    const nextAttachmentError = validateAttachmentFiles(
      files,
      remainingAttachmentSlots
    );

    if (nextAttachmentError) {
      setAttachmentError(nextAttachmentError);
      setSelectedFiles([]);
      event.target.value = "";
      toast.error(nextAttachmentError);
      return;
    }

    setAttachmentError("");
    setSelectedFiles(files);
  };

  const handleAttachmentUpload = async () => {
    if (!selectedFiles.length) return;

    try {
      setUploadSubmitting(true);
      setAttachmentError("");

      for (const file of selectedFiles) {
        await ticketService.uploadAttachment(id, file);
      }

      setSelectedFiles([]);
      setUploadInputKey((prev) => prev + 1);
      toast.success("Attachment(s) uploaded successfully.");
      await loadDetails({ showSpinner: false });
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to upload attachments."
      );
    } finally {
      setUploadSubmitting(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this attachment?"
    );

    if (!confirmed) return;

    try {
      setAttachmentActionId(attachmentId);
      await ticketService.deleteAttachment(attachmentId);
      toast.success("Attachment deleted successfully.");
      await loadDetails({ showSpinner: false });
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to delete attachment."
      );
    } finally {
      setAttachmentActionId(null);
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

                <div className="rounded-2xl bg-[#F5F8FC] p-4">
                  <p className="text-sm text-slate-500">Resolved At</p>
                  <p className="font-semibold text-[#123A7A]">
                    {ticket.resolvedAt
                      ? new Date(ticket.resolvedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F5F8FC] p-4">
                  <p className="text-sm text-slate-500">Closed At</p>
                  <p className="font-semibold text-[#123A7A]">
                    {ticket.closedAt
                      ? new Date(ticket.closedAt).toLocaleString()
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

            <TicketAttachmentGallery
              attachments={attachments}
              currentUserId={currentUserId}
              onDeleteAttachment={handleDeleteAttachment}
              deletingAttachmentId={attachmentActionId}
            />

            <TicketCommentSection
              comments={comments}
              newComment={newComment}
              setNewComment={(value) => {
                setNewComment(value);
                setCommentError("");
              }}
              newCommentError={commentError}
              onAddComment={handleAddComment}
              submitting={commentSubmitting}
              onUpdateComment={handleUpdateComment}
              onDeleteComment={handleDeleteComment}
              actionCommentId={commentActionId}
              currentUserId={currentUserId}
            />
          </div>

          <div className="space-y-6">
            {canAssignTicket ? (
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-xl font-bold text-[#123A7A]">
                  Assign Ticket
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                      Assign To
                    </label>
                    <select
                      value={assignForm.assignedToUserId}
                      onChange={(e) => {
                        setAssignForm({ assignedToUserId: e.target.value });
                        setAssignErrors({ assignedToUserId: "" });
                      }}
                      className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-[#2F80ED] ${
                        assignErrors.assignedToUserId
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200"
                      }`}
                    >
                      <option value="">
                        {assignableUsers.length
                          ? "Select staff/admin user"
                          : "No assignable users found"}
                      </option>
                      {assignableUsers.map((assignableUser) => (
                        <option
                          key={assignableUser.id}
                          value={assignableUser.id}
                        >
                          {assignableUser.name} ({assignableUser.role}) - #
                          {assignableUser.id}
                        </option>
                      ))}
                    </select>
                    {assignErrors.assignedToUserId ? (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {assignErrors.assignedToUserId}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-slate-500">
                      Only staff or admin users can be assigned to tickets.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAssignTicket}
                    disabled={assignSubmitting || !assignableUsers.length}
                    className="w-full rounded-full bg-[#123A7A] px-6 py-3 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {assignSubmitting ? "Assigning..." : "Assign Ticket"}
                  </button>
                </div>
              </div>
            ) : null}

            {canUploadAttachments ? (
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-xl font-bold text-[#123A7A]">
                  Upload Attachments
                </h2>

                <p className="mb-3 text-sm text-slate-500">
                  {attachments.length} / {MAX_TICKET_ATTACHMENTS} attachment(s) used
                </p>

                <div className="space-y-4">
                  <input
                    key={uploadInputKey}
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleFileSelection}
                    disabled={remainingAttachmentSlots === 0}
                    className={`w-full rounded-2xl border px-4 py-3 ${
                      attachmentError
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200"
                    }`}
                  />
                  {attachmentError ? (
                    <p className="text-xs font-medium text-red-600">
                      {attachmentError}
                    </p>
                  ) : null}

                  {selectedFiles.length ? (
                    <p className="text-sm text-slate-500">
                      {selectedFiles.length} file(s) selected
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleAttachmentUpload}
                    disabled={
                      uploadSubmitting ||
                      remainingAttachmentSlots === 0 ||
                      !selectedFiles.length
                    }
                    className="w-full rounded-full bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploadSubmitting ? "Uploading..." : "Upload Attachment(s)"}
                  </button>
                </div>
              </div>
            ) : null}

            {canManageStatus ? (
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-xl font-bold text-[#123A7A]">
                  Update Ticket Status
                </h2>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-[#F5F8FC] p-4 text-sm text-slate-600">
                    Current status:{" "}
                    <span className="font-semibold text-[#123A7A]">
                      {ticket.status}
                    </span>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                      Next Status
                    </label>
                    <select
                      value={statusForm.status}
                      onChange={(e) => {
                        const nextStatus = e.target.value;
                        setStatusForm((prev) => ({
                          ...prev,
                          status: nextStatus,
                          rejectionReason:
                            nextStatus === "REJECTED" ? prev.rejectionReason : "",
                          resolutionNotes:
                            nextStatus === "RESOLVED" ? prev.resolutionNotes : "",
                        }));
                        setStatusErrors({
                          status: "",
                          rejectionReason: "",
                          resolutionNotes: "",
                        });
                      }}
                      className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-[#2F80ED] ${
                        statusErrors.status
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200"
                      }`}
                      disabled={!transitionOptions.length}
                    >
                      <option value="">
                        {transitionOptions.length
                          ? "Select next status"
                          : "No further transitions available"}
                      </option>
                      {transitionOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {statusErrors.status ? (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {statusErrors.status}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                      Resolution Notes
                    </label>
                    <textarea
                      rows={4}
                      value={statusForm.resolutionNotes}
                      onChange={(e) => {
                        setStatusForm((prev) => ({
                          ...prev,
                          resolutionNotes: e.target.value,
                        }));
                        setStatusErrors((prev) => ({
                          ...prev,
                          resolutionNotes: "",
                        }));
                      }}
                      className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-[#2F80ED] ${
                        statusErrors.resolutionNotes
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200"
                      }`}
                      placeholder="Required when moving to RESOLVED"
                    />
                    {statusErrors.resolutionNotes ? (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {statusErrors.resolutionNotes}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                      Rejection Reason
                    </label>
                    <textarea
                      rows={4}
                      value={statusForm.rejectionReason}
                      onChange={(e) => {
                        setStatusForm((prev) => ({
                          ...prev,
                          rejectionReason: e.target.value,
                        }));
                        setStatusErrors((prev) => ({
                          ...prev,
                          rejectionReason: "",
                        }));
                      }}
                      className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-[#2F80ED] ${
                        statusErrors.rejectionReason
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200"
                      }`}
                      placeholder="Required when moving to REJECTED"
                      disabled={statusForm.status !== "REJECTED"}
                    />
                    {statusErrors.rejectionReason ? (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {statusErrors.rejectionReason}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    disabled={statusSubmitting || !transitionOptions.length}
                    className="w-full rounded-full bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {statusSubmitting ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailsPage;
