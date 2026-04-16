import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/dashboard/DashboardPage";
import LoginPage from "../pages/auth/LoginPage";
import ResourceListPage from "../pages/resources/ResourceListPage";
import BookingListPage from "../pages/booking/BookingListPage";
import TicketListPage from "../pages/tickets/TicketListPage";
import NotificationPage from "../pages/notifications/NotificationPage";
import ResourceFormPage from "../pages/resources/ResourceFormPage";
import ResourceAdminPage from "../pages/admin/resources/ResourceAdminPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/resources" element={<ResourceListPage />} />
      <Route path="/bookings" element={<BookingListPage />} />
      <Route path="/tickets" element={<TicketListPage />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/resources" element={<ResourceListPage />} />
      <Route path="/resources/new" element={<ResourceFormPage />} />
      <Route path="/admin/resources" element={<ResourceAdminPage />} />
    </Routes>
  );
}

export default AppRouter;
