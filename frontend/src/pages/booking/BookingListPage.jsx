import { useEffect, useMemo, useState } from "react";
import {
  getBookingsByStatus,
  approveBooking,
  rejectBooking
} from "../../services/bookingService";
import "./BookingPages.css";

const STATUS_TABS = [
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

function BookingListPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredBookings = useMemo(() => {
    const keyword = keywordFilter.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesKeyword =
        !keyword ||
        String(booking.id).includes(keyword) ||
        String(booking.resourceId).includes(keyword) ||
        String(booking.purpose || "").toLowerCase().includes(keyword);

      const matchesDate = !dateFilter || booking.bookingDate === dateFilter;

      return matchesKeyword && matchesDate;
    });
  }, [bookings, keywordFilter, dateFilter]);

  const loadBookings = async (status = statusFilter) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getBookingsByStatus(status);

      if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([]);
      }

    } catch (err) {
      console.error(err);
      setBookings([]);
      setError("Backend not available");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings(statusFilter);
  }, [statusFilter]);

  const handleApprove = async (bookingId) => {
    try {
      setActionLoadingId(bookingId);
      await approveBooking(bookingId);
      setStatusFilter("APPROVED");
    } catch (err) {
      console.error(err);
      setError("Failed to approve booking");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (bookingId) => {
    const reason = prompt("Reject reason");
    if (!reason) {
      return;
    }

    try {
      setActionLoadingId(bookingId);
      await rejectBooking(bookingId, reason);
      setStatusFilter("REJECTED");
    } catch (err) {
      console.error(err);
      setError("Failed to reject booking");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="booking-page booking-page-list">
      <div className="booking-page-glow" />
      <div className="booking-card booking-list-card">
        <div className="booking-list-header">
          <div>
            <h2 className="booking-title">Admin Bookings</h2>
            <p className="booking-subtitle">View bookings by status and process pending requests.</p>
          </div>
          <button className="booking-secondary-btn" onClick={() => loadBookings(statusFilter)}>
            Refresh
          </button>
        </div>

        <div className="booking-status-tabs" role="tablist" aria-label="Booking status filters">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`booking-status-tab ${statusFilter === tab.key ? "is-active" : ""}`}
              onClick={() => setStatusFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="booking-filter-row">
          <input
            type="text"
            className="booking-filter-input"
            placeholder="Filter by Booking ID, Resource ID, or Purpose"
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
          />

          <input
            type="date"
            className="booking-filter-input booking-filter-date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />

          <button
            type="button"
            className="booking-secondary-btn"
            onClick={() => {
              setKeywordFilter("");
              setDateFilter("");
            }}
          >
            Clear
          </button>
        </div>

        {loading && <p className="booking-muted">Loading bookings...</p>}
        {error && <p className="booking-message booking-message-error">{error}</p>}
        {!loading && bookings.length === 0 && (
          <p className="booking-muted">No {statusFilter.toLowerCase()} bookings.</p>
        )}
        {!loading && bookings.length > 0 && filteredBookings.length === 0 && (
          <p className="booking-muted">No bookings match the current filters.</p>
        )}

        <div className="booking-list-grid">
          {!loading &&
            filteredBookings.map((booking) => (
              <article key={booking.id} className="booking-item">
                <div className="booking-item-head">
                  <h3>Booking #{booking.id}</h3>
                  <span className={`booking-chip booking-chip-${booking.status?.toLowerCase() || "pending"}`}>
                    {booking.status || "PENDING"}
                  </span>
                </div>

                <p><strong>Resource:</strong> {booking.resourceId}</p>
                <p><strong>Date:</strong> {booking.bookingDate}</p>
                <p>
                  <strong>Time:</strong> {booking.startTime} - {booking.endTime}
                </p>
                <p><strong>Purpose:</strong> {booking.purpose}</p>

                {statusFilter === "PENDING" ? (
                  <div className="booking-actions">
                    <button
                      onClick={() => handleApprove(booking.id)}
                      className="booking-success-btn"
                      disabled={actionLoadingId === booking.id}
                    >
                      {actionLoadingId === booking.id ? "Processing..." : "Approve"}
                    </button>

                    <button
                      onClick={() => handleReject(booking.id)}
                      className="booking-danger-btn"
                      disabled={actionLoadingId === booking.id}
                    >
                      {actionLoadingId === booking.id ? "Processing..." : "Reject"}
                    </button>
                  </div>
                ) : null}
              </article>
            ))}
        </div>
      </div>
    </div>
  );
}

export default BookingListPage;