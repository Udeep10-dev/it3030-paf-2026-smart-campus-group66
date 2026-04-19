import { Routes, Route } from "react-router-dom";

import DashboardPage from "../pages/dashboard/DashboardPage";
import LoginPage from "../pages/auth/LoginPage";

import ResourceListPage from "../pages/resources/ResourceListPage";
import ResourceFormPage from "../pages/resources/ResourceFormPage";
import ResourceAdminPage from "../pages/admin/resources/ResourceAdminPage";

import BookingFormPage from "../pages/booking/BookingFormPage";
import BookingListPage from "../pages/booking/BookingListPage";

import NotificationPage from "../pages/notifications/NotificationPage";


import TicketListPage from "../pages/tickets/TicketListPage";
import TicketCreatePage from "../pages/tickets/TicketCreatePage";
import TicketDetailsPage from "../pages/tickets/TicketDetailsPage";


function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Resources */}
      <Route path="/resources" element={<ResourceListPage />} />
      <Route path="/admin/resources" element={<ResourceAdminPage />} />

      {/* Bookings */}
      <Route path="/bookings/new" element={<BookingFormPage />} />
      <Route path="/booking/new" element={<BookingFormPage />} />
      <Route path="/admin/bookings" element={<BookingListPage />} />

      {/* ticket */}
      <Route path="/tickets" element={<TicketListPage />} />
      <Route path="/tickets/new" element={<TicketCreatePage />} />
      <Route path="/tickets/:id" element={<TicketDetailsPage />} />

      <Route path="/notifications" element={<NotificationPage />} />
    </Routes>
  );
}

export default AppRouter;
``