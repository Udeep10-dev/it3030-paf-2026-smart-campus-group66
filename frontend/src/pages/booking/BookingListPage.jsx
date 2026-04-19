import { useEffect, useState } from "react";
import {
  getBookingsByStatus,
  approveBooking,
  rejectBooking
} from "../../services/bookingService";
import "./BookingPages.css";

function BookingListPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getBookingsByStatus("PENDING");

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
    loadBookings();
  }, []);

  const handleApprove = async (bookingId) => {
    try {
      setActionLoadingId(bookingId);
      await approveBooking(bookingId);
      await loadBookings();
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
      await loadBookings();
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
          <h2 className="booking-title">Pending Bookings</h2>
          <button className="booking-secondary-btn" onClick={loadBookings}>
            Refresh
          </button>
        </div>

        {loading && <p className="booking-muted">Loading bookings...</p>}
        {error && <p className="booking-message booking-message-error">{error}</p>}
        {!loading && bookings.length === 0 && <p className="booking-muted">No pending bookings.</p>}

        <div className="booking-list-grid">
          {!loading &&
            bookings.map((booking) => (
              <article key={booking.id} className="booking-item">
                <div className="booking-item-head">
                  <h3>Booking #{booking.id}</h3>
                  <span className="booking-chip">PENDING</span>
                </div>

                <p><strong>Resource:</strong> {booking.resourceId}</p>
                <p><strong>Date:</strong> {booking.bookingDate}</p>
                <p>
                  <strong>Time:</strong> {booking.startTime} - {booking.endTime}
                </p>
                <p><strong>Purpose:</strong> {booking.purpose}</p>

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
              </article>
            ))}
        </div>
      </div>
    </div>
  );
}

export default BookingListPage;