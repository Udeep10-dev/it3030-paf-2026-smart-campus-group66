import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { createBooking, getBookingsByStatus } from "../../services/bookingService";
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

const MIN_BOOKING_TIME = "08:00";
const MAX_BOOKING_TIME = "17:00";

const timeToMinutes = (timeValue) => {
  const value = String(timeValue || "").trim();
  if (!value) {
    return null;
  }

  const [hh = "0", mm = "0"] = value.split(":");
  const hours = Number(hh);
  const minutes = Number(mm);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
};

const formatSlotTime = (timeValue) => {
  const value = String(timeValue || "").trim();
  if (!value) {
    return "";
  }
  const [hh = "00", mm = "00"] = value.split(":");
  return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
};

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ");

const buildUniqueOptions = (items, getter) => {
  const seen = new Set();

  return items
    .map((item) => normalizeText(getter(item)))
    .filter((value) => {
      if (!value) {
        return false;
      }

      const key = value.toLowerCase();
      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value, label: value }));
};

function BookingFormPage() {
  const [form, setForm] = useState({
    category: "",
    resourceId: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    expectedAttendees: "",
    purpose: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [attendeesError, setAttendeesError] = useState("");
  const [startTimeError, setStartTimeError] = useState("");
  const [endTimeError, setEndTimeError] = useState("");
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [activeBookings, setActiveBookings] = useState([]);
  const [conflictError, setConflictError] = useState("");

  const today = useMemo(() => toDateInputValue(), []);
  const nowTime = useMemo(() => toTimeInputValue(), []);
  const categoryOptions = useMemo(
    () => {
      const options = buildUniqueOptions(resources, (resource) => resource.category);

      return options.sort((a, b) => a.value.localeCompare(b.value));
    },
    [resources]
  );
  const filteredResources = useMemo(() => {
    if (!form.category) {
      return resources;
    }

    const selectedCategory = form.category.toLowerCase();
    return resources.filter(
      (resource) => normalizeText(resource.category || "").toLowerCase() === selectedCategory
    );
  }, [resources, form.category]);
  const selectedResource = useMemo(
    () => filteredResources.find((resource) => String(resource.id) === form.resourceId),
    [filteredResources, form.resourceId]
  );
  const visibleResources = useMemo(() => {
    if (showSelectedOnly && selectedResource) {
      return [selectedResource];
    }

    return filteredResources;
  }, [showSelectedOnly, selectedResource, filteredResources]);
  const resourceLabel = form.category ? `${form.category}s` : "Available Resources";
  const bookedSlotsForSelectedDate = useMemo(() => {
    if (!form.resourceId || !form.bookingDate) {
      return [];
    }

    return activeBookings
      .filter((booking) => {
        const sameResource = String(booking?.resourceId) === String(form.resourceId);
        const sameDate = booking?.bookingDate === form.bookingDate;
        return sameResource && sameDate && booking?.startTime && booking?.endTime;
      })
      .sort((a, b) => {
        const aMinutes = timeToMinutes(a.startTime) ?? 0;
        const bMinutes = timeToMinutes(b.startTime) ?? 0;
        return aMinutes - bMinutes;
      });
  }, [activeBookings, form.resourceId, form.bookingDate]);

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
      } catch (error) {
        const status = error?.response?.status;
        const reason = status ? `HTTP ${status}` : error?.message || "network error";
        setResources([]);
        setMessage({
          type: "error",
          text: `Live resources could not be loaded (${reason}).`,
        });
      } finally {
        setLoadingResources(false);
      }
    };

    loadResources();
  }, []);

  useEffect(() => {
    const loadActiveBookings = async () => {
      try {
        const [pendingRes, approvedRes] = await Promise.all([
          getBookingsByStatus("PENDING"),
          getBookingsByStatus("APPROVED"),
        ]);

        const pending = Array.isArray(pendingRes?.data) ? pendingRes.data : [];
        const approved = Array.isArray(approvedRes?.data) ? approvedRes.data : [];
        setActiveBookings([...pending, ...approved]);
      } catch {
        setActiveBookings([]);
      }
    };

    loadActiveBookings();
  }, []);

  useEffect(() => {
    if (!form.resourceId || !form.bookingDate || !form.startTime || !form.endTime) {
      setConflictError("");
      return;
    }

    const requestedStartMinutes = timeToMinutes(form.startTime);
    const requestedEndMinutes = timeToMinutes(form.endTime);

    if (
      requestedStartMinutes === null ||
      requestedEndMinutes === null ||
      requestedStartMinutes >= requestedEndMinutes
    ) {
      setConflictError("");
      return;
    }

    const hasConflict = activeBookings.some((booking) => {
      const sameResource = String(booking?.resourceId) === String(form.resourceId);
      const sameDate = booking?.bookingDate === form.bookingDate;
      if (!sameResource || !sameDate) {
        return false;
      }

      const existingStart = booking?.startTime;
      const existingEnd = booking?.endTime;
      if (!existingStart || !existingEnd) {
        return false;
      }

      const existingStartMinutes = timeToMinutes(existingStart);
      const existingEndMinutes = timeToMinutes(existingEnd);
      if (existingStartMinutes === null || existingEndMinutes === null) {
        return false;
      }

      return (
        requestedStartMinutes < existingEndMinutes &&
        requestedEndMinutes > existingStartMinutes
      );
    });

    setConflictError(
      hasConflict
        ? "This resource is already booked for the selected time range. Please choose another time slot."
        : ""
    );
  }, [form.resourceId, form.bookingDate, form.startTime, form.endTime, activeBookings]);

  useEffect(() => {
    if (loadingResources) {
      return;
    }

    if (categoryOptions.length > 0 && !form.category) {
      setForm((prev) => ({
        ...prev,
        category: categoryOptions[0].value,
      }));
      return;
    }

    if (filteredResources.length === 0) {
      if (form.resourceId) {
        setForm((prev) => ({ ...prev, resourceId: "" }));
      }
      return;
    }

    const currentExists = filteredResources.some(
      (resource) => String(resource.id) === form.resourceId
    );

    if (!currentExists) {
      setForm((prev) => ({
        ...prev,
        resourceId: String(filteredResources[0].id),
      }));
    }
  }, [loadingResources, categoryOptions, filteredResources, form.category, form.resourceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === "category") {
        setShowSelectedOnly(false);
        return {
          ...prev,
          category: value,
          resourceId: "",
        };
      }

      return { ...prev, [name]: value };
    });

    if (name === "expectedAttendees") {
      const parsed = Number(value);
      if (!value || (Number.isInteger(parsed) && parsed >= 10)) {
        setAttendeesError("");
      }
    }

    if (name === "startTime") {
      if (!value || value >= MIN_BOOKING_TIME) {
        setStartTimeError("");
      }

      if (form.endTime) {
        setEndTimeError(validateEndTime(form.endTime, value));
      }
    }

    if (name === "endTime") {
      if (!value || value <= MAX_BOOKING_TIME) {
        setEndTimeError("");
      }

      if (form.startTime) {
        setStartTimeError(validateStartTime(form.startTime, value));
      }
    }
  };

  const validateStartTime = (value, endTime = form.endTime) => {
    if (!value) {
      return "Start time is required.";
    }

    if (value < MIN_BOOKING_TIME) {
      return "Start time cannot be earlier than 8:00 AM.";
    }

    if (value > MAX_BOOKING_TIME) {
      return "Start time cannot be later than 5:00 PM.";
    }

    if (endTime && value >= endTime) {
      return "Start time must be earlier than end time.";
    }

    return "";
  };

  const validateExpectedAttendees = (value) => {
    if (!value) {
      return "Expected attendees is required.";
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 10) {
      return "Minimum 10 attendees are required.";
    }

    const capacity = Number(selectedResource?.capacity);
    if (Number.isFinite(capacity) && parsed > capacity) {
      return `Expected attendees cannot exceed selected resource capacity (${capacity}).`;
    }

    return "";
  };

  useEffect(() => {
    if (!form.expectedAttendees) {
      setAttendeesError("");
      return;
    }

    setAttendeesError(validateExpectedAttendees(form.expectedAttendees));
  }, [form.expectedAttendees, selectedResource]);

  const handleExpectedAttendeesBlur = () => {
    setAttendeesError(validateExpectedAttendees(form.expectedAttendees));
  };

  const validateEndTime = (value, startTime = form.startTime) => {
    if (!value) {
      return "End time is required.";
    }

    if (value > MAX_BOOKING_TIME) {
      return "End time cannot be later than 5:00 PM.";
    }

    if (startTime && value <= startTime) {
      return "End time must be later than start time.";
    }

    return "";
  };

  const handleStartTimeBlur = () => {
    setStartTimeError(validateStartTime(form.startTime));
  };

  const handleEndTimeBlur = () => {
    setEndTimeError(validateEndTime(form.endTime));
  };

  const handleResourceSelect = (resourceId) => {
    setForm((prev) => ({
      ...prev,
      resourceId: String(resourceId),
    }));
    setShowSelectedOnly(true);
  };

  const submitBooking = async (e) => {
    e.preventDefault();

    if (!form.bookingDate || !form.startTime || !form.endTime || !form.expectedAttendees || !form.purpose.trim()) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    const startTimeValidationError = validateStartTime(form.startTime);
    if (startTimeValidationError) {
      setStartTimeError(startTimeValidationError);
      setMessage({ type: "error", text: startTimeValidationError });
      return;
    }

    const expectedAttendeesValidationError = validateExpectedAttendees(form.expectedAttendees);
    if (expectedAttendeesValidationError) {
      setAttendeesError(expectedAttendeesValidationError);
      setMessage({ type: "error", text: expectedAttendeesValidationError });
      return;
    }

    if (!form.resourceId && filteredResources[0]) {
      setForm((prev) => ({
        ...prev,
        resourceId: String(filteredResources[0].id),
      }));
    }

    if (!form.resourceId) {
      setMessage({ type: "error", text: "No resource available for booking." });
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

    const startTimeOrderError = validateStartTime(form.startTime, form.endTime);
    if (startTimeOrderError) {
      setStartTimeError(startTimeOrderError);
      setMessage({ type: "error", text: startTimeOrderError });
      return;
    }

    const endTimeOrderError = validateEndTime(form.endTime, form.startTime);
    if (endTimeOrderError) {
      setEndTimeError(endTimeOrderError);
      setMessage({ type: "error", text: endTimeOrderError });
      return;
    }

    if (conflictError) {
      setMessage({ type: "error", text: conflictError });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await createBooking(form);
      setMessage({ type: "success", text: "Booking request sent successfully." });
      setForm({
        category: categoryOptions[0]?.value || "",
        resourceId: "",
        bookingDate: "",
        startTime: "",
        endTime: "",
        expectedAttendees: "",
        purpose: "",
      });
      setAttendeesError("");
      setStartTimeError("");
      setEndTimeError("");
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
      <div className="booking-page-header">
        <Link to="/bookings" className="booking-secondary-btn booking-my-booking-btn">
          My Booking
        </Link>
      </div>

      <form className="booking-card booking-form-card" onSubmit={submitBooking} noValidate>
        <h2 className="booking-title">Create Booking Request</h2>
        <p className="booking-subtitle">Reserve resources in a few quick steps.</p>

        {message.text ? (
          <p className={`booking-message booking-message-${message.type}`}>{message.text}</p>
        ) : null}

        <div className="booking-form-grid">
          <label className="booking-field">
            <span>Category</span>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={loadingResources || categoryOptions.length === 0}
            >
              <option value="">
                {loadingResources
                  ? "Loading categories..."
                  : categoryOptions.length > 0
                    ? "Select category"
                    : "No categories"}
              </option>
              {categoryOptions.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <div className="booking-resource-details booking-field-wide">
            <div className="booking-resource-header">
              <h3>{resourceLabel}</h3>
              <div className="booking-resource-actions">
                {selectedResource ? <span className="booking-resource-pill">Auto-selected for booking</span> : null}
                {showSelectedOnly && filteredResources.length > 1 ? (
                  <button
                    type="button"
                    className="booking-link-btn"
                    onClick={() => setShowSelectedOnly(false)}
                  >
                    Show all
                  </button>
                ) : null}
              </div>
            </div>

            {visibleResources.length > 0 ? (
              <div className="booking-resource-list">
                {visibleResources.map((resource) => {
                  const isSelected = String(resource.id) === form.resourceId;

                  return (
                    <article
                      key={resource.id}
                      className={`booking-resource-item${isSelected ? " is-selected" : ""}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleResourceSelect(resource.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleResourceSelect(resource.id);
                        }
                      }}
                      aria-pressed={isSelected}
                    >
                      <div className="booking-resource-item-top">
                        <div>
                          <h4>{resource.name}</h4>
                          <p>{resource.location}</p>
                        </div>
                        <span>{resource.status || "AVAILABLE"}</span>
                      </div>
                      <div className="booking-resource-grid">
                        <p><strong>Name:</strong> {resource.name}</p>
                        <p><strong>Location:</strong> {resource.location}</p>
                        <p><strong>Capacity:</strong> {resource.capacity}</p>
                        <p><strong>Type:</strong> {resource.type}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="booking-muted">
                {loadingResources ? "Loading resource details..." : "No available resources for selected category."}
              </p>
            )}
          </div>

          {selectedResource && form.bookingDate ? (
            <div className="booking-booked-slots booking-field-wide">
              <h4>Booked Time Slots for {selectedResource.name}</h4>
              {bookedSlotsForSelectedDate.length > 0 ? (
                <ul>
                  {bookedSlotsForSelectedDate.map((booking) => (
                    <li key={booking.id}>
                      <strong>{formatSlotTime(booking.startTime)} - {formatSlotTime(booking.endTime)}</strong>
                      <span>{booking.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="booking-muted">No booked time slots found for selected date.</p>
              )}
            </div>
          ) : null}

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
              onBlur={handleStartTimeBlur}
              min={form.bookingDate === today ? (nowTime > MIN_BOOKING_TIME ? nowTime : MIN_BOOKING_TIME) : MIN_BOOKING_TIME}
              max={MAX_BOOKING_TIME}
              className={startTimeError ? "booking-input-error" : ""}
              required
            />
            {startTimeError ? <span className="booking-field-error">{startTimeError}</span> : null}
          </label>

          <label className="booking-field">
            <span>End Time</span>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              onBlur={handleEndTimeBlur}
              min={form.startTime || undefined}
              max={MAX_BOOKING_TIME}
              className={endTimeError ? "booking-input-error" : ""}
              required
            />
            {endTimeError ? <span className="booking-field-error">{endTimeError}</span> : null}
            {!endTimeError && conflictError ? (
              <span className="booking-field-error">{conflictError}</span>
            ) : null}
          </label>

          <label className="booking-field">
            <span>Expected Attendees</span>
            <input
              type="number"
              name="expectedAttendees"
              value={form.expectedAttendees}
              onChange={handleChange}
              onBlur={handleExpectedAttendeesBlur}
              min="10"
              step="1"
              placeholder="Enter expected attendees"
              className={attendeesError ? "booking-input-error" : ""}
              required
            />
            {attendeesError ? <span className="booking-field-error">{attendeesError}</span> : null}
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
          disabled={submitting || loadingResources || filteredResources.length === 0 || !!conflictError}
        >
          {submitting ? "Submitting..." : "Submit Booking"}
        </button>
      </form>
    </div>
  );
}

export default BookingFormPage;
