import { useEffect, useState } from "react";
import {
  getBookingsByStatus,
  approveBooking,
  rejectBooking
} from "../../services/bookingService";

function BookingListPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getBookingsByStatus("PENDING");

      // ✅ FORCE array
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

  return (
    <div>
      <h2>Pending Bookings (Admin)</h2>

      {loading && <p>Loading bookings...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && bookings.length === 0 && (
        <p>No pending bookings</p>
      )}

      {!loading &&
        bookings.map((booking) => (
          <div
            key={booking.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            <p><strong>ID:</strong> {booking.id}</p>
            <p><strong>Resource:</strong> {booking.resourceId}</p>
            <p><strong>Date:</strong> {booking.bookingDate}</p>
            <p>
              <strong>Time:</strong> {booking.startTime} - {booking.endTime}
            </p>
            <p><strong>Purpose:</strong> {booking.purpose}</p>

            <button onClick={() => approveBooking(booking.id)}>
              Approve
            </button>

            <button
              onClick={() => {
                const reason = prompt("Reject reason");
                if (reason) rejectBooking(booking.id, reason);
              }}
              style={{ marginLeft: "10px" }}
            >
              Reject
            </button>
          </div>
        ))}
    </div>
  );
}

export default BookingListPage;