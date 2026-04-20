import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import resourceService from "../../services/resourceService";
import ticketService from "../../services/ticketService";
import {
  MAX_TICKET_ATTACHMENTS,
  validateAttachmentFiles,
  validateTicketForm,
} from "../../utils/ticketFormValidation";

const initialForm = {
  resourceId: "",
  location: "",
  category: "",
  description: "",
  priority: "",
  preferredContact: "",
};

function TicketCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [errors, setErrors] = useState({});

  const selectedResource = useMemo(
    () => resources.find((resource) => String(resource.id) === form.resourceId),
    [resources, form.resourceId]
  );

  useEffect(() => {
    const loadResources = async () => {
      setLoadingResources(true);

      try {
        const res = await resourceService.getAll();
        const rows = Array.isArray(res?.data) ? res.data : [];
        setResources(rows);
      } catch {
        toast.error(
          "Resources could not be loaded. You can still submit a location-based ticket."
        );
      } finally {
        setLoadingResources(false);
      }
    };

    loadResources();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "resourceId") {
      const resource = resources.find((item) => String(item.id) === value);

      setForm((prev) => ({
        ...prev,
        resourceId: value,
        location: resource?.location || prev.location,
      }));
      setErrors((prev) => ({
        ...prev,
        resourceId: "",
        location: "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      ...(name === "location" ? { location: "" } : {}),
    }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const attachmentError = validateAttachmentFiles(
      selected,
      MAX_TICKET_ATTACHMENTS
    );

    if (attachmentError) {
      setErrors((prev) => ({ ...prev, attachments: attachmentError }));
      setFiles([]);
      e.target.value = "";
      toast.error(attachmentError);
      return;
    }

    setErrors((prev) => ({ ...prev, attachments: "" }));
    setFiles(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {
      ...validateTicketForm(form),
    };
    const attachmentError = validateAttachmentFiles(
      files,
      MAX_TICKET_ATTACHMENTS
    );

    if (attachmentError) {
      validationErrors.attachments = attachmentError;
    }

    if (Object.values(validationErrors).some(Boolean)) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields before submitting.");
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const payload = {
        resourceId:
          form.resourceId && Number(form.resourceId) > 0
            ? Number(form.resourceId)
            : null,
        location: form.location.trim() || null,
        category: form.category,
        description: form.description.trim(),
        priority: form.priority,
        preferredContact: form.preferredContact.trim() || null,
      };

      const res = await ticketService.create(payload);
      const ticketId = res.data?.id;

      if (ticketId && files.length > 0) {
        for (const file of files) {
          await ticketService.uploadAttachment(ticketId, file);
        }
      }

      toast.success("Ticket created successfully.");

      setTimeout(() => {
        navigate(`/tickets/${ticketId}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to create ticket. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#2F80ED]">
            Maintenance Module
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#123A7A]">
            Create Incident Ticket
          </h1>
          <p className="mt-2 text-slate-600">
            Report a campus issue with description, priority, and attachments.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                Resource
              </label>
              <select
                name="resourceId"
                value={form.resourceId}
                onChange={handleChange}
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-[#2F80ED] ${
                  errors.location ? "border-red-300 bg-red-50" : "border-slate-200"
                }`}
              >
                <option value="">
                  {loadingResources
                    ? "Loading resources..."
                    : "No specific resource selected"}
                </option>
                {resources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name} ({resource.resourceCode || `ID ${resource.id}`})
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Choose a real resource if the issue is tied to one. Otherwise, leave this empty and use the location field.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Ex: Lab 03, Floor 2"
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-[#2F80ED] ${
                  errors.location ? "border-red-300 bg-red-50" : "border-slate-200"
                }`}
              />
              {errors.location ? (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {errors.location}
                </p>
              ) : null}
              {selectedResource ? (
                <p className="mt-2 text-xs text-slate-500">
                  Selected resource location: {selectedResource.location || "Not specified"}
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-500">
                  Use a location like `Lab 03`, `A-301`, or `Library Level 2`.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-[#2F80ED] ${
                  errors.category ? "border-red-300 bg-red-50" : "border-slate-200"
                }`}
              >
                <option value="">Select category</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="NETWORK">NETWORK</option>
                <option value="PROJECTOR">PROJECTOR</option>
                <option value="FURNITURE">FURNITURE</option>
                <option value="CLEANING">CLEANING</option>
                <option value="OTHER">OTHER</option>
              </select>
              {errors.category ? (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {errors.category}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                Priority *
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-[#2F80ED] ${
                  errors.priority ? "border-red-300 bg-red-50" : "border-slate-200"
                }`}
              >
                <option value="">Select priority</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
              {errors.priority ? (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {errors.priority}
                </p>
              ) : null}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                Preferred Contact
              </label>
              <input
                type="text"
                name="preferredContact"
                value={form.preferredContact}
                onChange={handleChange}
                placeholder="Phone number or email"
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-[#2F80ED] ${
                  errors.preferredContact
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200"
                }`}
              />
              {errors.preferredContact ? (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {errors.preferredContact}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-slate-500">
                Use phone or email so the maintenance team can reach you.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                Description *
              </label>
              <textarea
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the issue clearly..."
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-[#2F80ED] ${
                  errors.description
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200"
                }`}
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                {errors.description ? (
                  <p className="text-xs font-medium text-red-600">
                    {errors.description}
                  </p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-slate-400">
                  {form.description.trim().length}/1000
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                Attachments (max 3 images)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className={`w-full rounded-2xl border px-4 py-3 ${
                  errors.attachments
                    ? "border-red-300 bg-red-50"
                    : "border-slate-200"
                }`}
              />
              {errors.attachments ? (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {errors.attachments}
                </p>
              ) : null}
              {files.length > 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  {files.length} file(s) selected
                </p>
              ) : null}
            </div>
          </div>

          {selectedResource ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p className="font-semibold text-[#123A7A]">
                Selected Resource Details
              </p>
              <p className="mt-1">
                {selectedResource.name} ({selectedResource.resourceCode || `ID ${selectedResource.id}`})
              </p>
              <p>Type: {selectedResource.type || "N/A"}</p>
              <p>Status: {selectedResource.status || "N/A"}</p>
              <p>Location: {selectedResource.location || "N/A"}</p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Ticket"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/tickets")}
              className="rounded-full border border-[#123A7A] px-6 py-3 font-semibold text-[#123A7A] transition hover:bg-[#123A7A] hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TicketCreatePage;
