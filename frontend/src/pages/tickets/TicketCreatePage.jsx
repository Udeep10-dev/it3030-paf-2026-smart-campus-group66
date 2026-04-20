import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import resourceService from "../../services/resourceService";
import ticketService from "../../services/ticketService";

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
  const [message, setMessage] = useState({ type: "", text: "" });
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);

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
        setMessage({
          type: "error",
          text: "Resources could not be loaded. You can still submit a location-based ticket.",
        });
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
      setMessage({ type: "", text: "" });
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 3) {
      setMessage({
        type: "error",
        text: "You can upload a maximum of 3 attachments.",
      });
      return;
    }

    setMessage({ type: "", text: "" });
    setFiles(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.resourceId && !form.location.trim()) {
      setMessage({
        type: "error",
        text: "Please provide either a Resource ID or a location.",
      });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

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

      setMessage({
        type: "success",
        text: "Ticket created successfully.",
      });

      setTimeout(() => {
        navigate(`/tickets/${ticketId}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Failed to create ticket. Please try again.",
      });
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
          className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"
        >
          {message.text ? (
            <div
              className={`mb-5 rounded-2xl px-4 py-3 text-sm font-medium ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                Resource
              </label>
              <select
                name="resourceId"
                value={form.resourceId}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2F80ED]"
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
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2F80ED]"
              />
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
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2F80ED]"
              >
                <option value="">Select category</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="NETWORK">NETWORK</option>
                <option value="PROJECTOR">PROJECTOR</option>
                <option value="FURNITURE">FURNITURE</option>
                <option value="CLEANING">CLEANING</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#123A7A]">
                Priority *
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2F80ED]"
              >
                <option value="">Select priority</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
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
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2F80ED]"
              />
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
                required
                placeholder="Describe the issue clearly..."
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2F80ED]"
              />
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
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
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
