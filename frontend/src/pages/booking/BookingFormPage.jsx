import { useEffect, useMemo, useState } from "react";
import { createBooking } from "../../services/bookingService";
import resourceService from "../../services/resourceService";
import "./BookingPages.css";

const toDateInputValue = (date = new Date()) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0];
};

const toTimeInputValue = (date = new Date()) => {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

function BookingFormPage() {
  const [form, setForm] = useState({
    resourceId: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);

  const today = useMemo(() => toDateInputValue(), []);
  const nowTime = toTimeInputValue();
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
        const available = rows.filter(
          (resource) => (resource?.status || "").toUpperCase() === "AVAILABLE"
        );
        setResources(available);
      } catch {
        setResources([]);
      } finally {
        setLoadingResources(false);
      }
    };

    loadResources();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!form.resourceId) {
      setMessage({ type: "error", text: "Please select a resource." });
      return;
    }

    if (form.bookingDate < today) {
      setMessage({ type: "error", text: "Booking date cannot be in the past." });
      return;
    }

    if (form.bookingDate === today && form.startTime < toTimeInputValue()) {
      setMessage({ type: "error", text: "Start time cannot be in the past." });
      return;
    }

    if (form.startTime >= form.endTime) {
      setMessage({ type: "error", text: "End time must be after start time." });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await createBooking(form);
      setMessage({ type: "success", text: "Booking request sent successfully." });
      setForm({
        resourceId: "",
        bookingDate: "",
        startTime: "",
        endTime: "",
        purpose: ""
      });
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      setMessage({
        type: "error",
        text: backendMessage || "Error creating booking. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-page booking-page-form">
      <div className="booking-page-glow" />
      <form className="booking-card booking-form-card" onSubmit={submitBooking}>
        <h2 className="booking-title">Create Booking Request</h2>
        <p className="booking-subtitle">Reserve resources in a few quick steps.</p>

        {message.text ? (
          <p className={`booking-message booking-message-${message.type}`}>{message.text}</p>
        ) : null}

        <div className="booking-form-grid">
          <label className="booking-field">
            <span>Resource</span>
            <select
              name="resourceId"
              value={form.resourceId}
              onChange={handleChange}
              disabled={loadingResources || resources.length === 0}
              required
            >
              <option value="">
                {loadingResources
                  ? "Loading resources..."
                  : resources.length > 0
                    ? "Select a resource"
                    : "No available resources"}
              </option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name} ({resource.resourceCode})
                </option>
              ))}
            </select>
          </label>

          <div className="booking-resource-details booking-field-wide">
            <h3>Selected Resource Details</h3>
            {selectedResource ? (
              <div className="booking-resource-grid">
                <p><strong>Name:</strong> {selectedResource.name}</p>
                <p><strong>Code:</strong> {selectedResource.resourceCode}</p>
                <p><strong>Type:</strong> {selectedResource.type}</p>
                <p><strong>Capacity:</strong> {selectedResource.capacity} people</p>
                <p><strong>Location:</strong> {selectedResource.location}</p>
                <p>
                  <strong>Available:</strong> {selectedResource.availabilityStart} - {selectedResource.availabilityEnd}
                </p>
                {selectedResource.description ? (
                  <p className="booking-resource-description">
                    <strong>Description:</strong> {selectedResource.description}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="booking-muted">Select a resource to view details.</p>
            )}
          </div>

          <label className="booking-field">
            <span>Booking Date</span>
            <input
              type="date"
              name="bookingDate"
              value={form.bookingDate}
              onChange={handleChange}
              min={today}
              required
            />
          </label>

          <label className="booking-field">
            <span>Start Time</span>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              min={form.bookingDate === today ? nowTime : undefined}
              required
            />
          </label>

          <label className="booking-field">
            <span>End Time</span>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              min={form.startTime || undefined}
              required
            />
          </label>

          <label className="booking-field booking-field-wide">
            <span>Purpose</span>
            <textarea
              name="purpose"
              placeholder="Why do you need this resource?"
              value={form.purpose}
              onChange={handleChange}
              rows={4}
              required
            />
          </label>
        </div>

        <button
          type="submit"
          className="booking-primary-btn"
          disabled={submitting || loadingResources || resources.length === 0}
        >
          {submitting ? "Submitting..." : "Submit Booking"}
        </button>
      </form>
    </div>
  );
}

export default BookingFormPage;