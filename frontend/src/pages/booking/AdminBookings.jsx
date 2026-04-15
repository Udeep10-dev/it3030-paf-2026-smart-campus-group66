import { useEffect, useState } from "react";
import bookingService from "../services/bookingService";

function AdminBookings() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    bookingService.getPendingBookings()
      .then(data => setBookings(data));
  }, []);

  return (
    <div>
      <h2>Pending Bookings (Admin)</h2>

      {bookings.map(b => (
        <div key={b.id}>
          <p>
            Date: {b.bookingDate} |
            {b.startTime} - {b.endTime}
          </p>

          <button onClick={() => bookingService.approve(b.id)}>
            Approve
          </button>

          <button onClick={() => bookingService.reject(b.id)}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminBookings;