import { useState } from "react";
import { createBooking } from "../../services/bookingService";

function BookingFormPage() {
  const [form, setForm] = useState({
    resourceId: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitBooking = async () => {
    try {
      await createBooking(form);
      alert("Booking request sent!");
      setForm({
        resourceId: "",
        bookingDate: "",
        startTime: "",
        endTime: "",
        purpose: ""
      });
    } catch (err) {
      alert("Error creating booking");
    }
  };

  return (
    <div>
      <h2>Create Booking</h2>

      <input
        name="resourceId"
        placeholder="Resource ID"
        value={form.resourceId}
        onChange={handleChange}
      />

      <input
        type="date"
        name="bookingDate"
        value={form.bookingDate}
        onChange={handleChange}
      />

      <input
        type="time"
        name="startTime"
        value={form.startTime}
        onChange={handleChange}
      />

      <input
        type="time"
        name="endTime"
        value={form.endTime}
        onChange={handleChange}
      />

      <input
        name="purpose"
        placeholder="Purpose"
        value={form.purpose}
        onChange={handleChange}
      />

      <button onClick={submitBooking}>Submit Booking</button>
    </div>
  );
}

export default BookingFormPage;