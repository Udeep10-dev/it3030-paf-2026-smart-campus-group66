import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";

import ResourceListPage from "../pages/resources/ResourceListPage";
// import ResourceFormPage from "../pages/resources/ResourceFormPage";
import ResourceAdminPage from "../pages/admin/resources/ResourceAdminPage";

import BookingFormPage from "../pages/booking/BookingFormPage";
import BookingListPage from "../pages/booking/BookingListPage";

import NotificationPage from "../pages/notifications/NotificationPage";
import AdminNotificationPage from "../pages/notifications/AdminNotificationPage";

import TicketListPage from "../pages/tickets/TicketListPage";
import TicketCreatePage from "../pages/tickets/TicketCreatePage";
import TicketDetailsPage from "../pages/tickets/TicketDetailsPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resources"
        element={
          <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
            <ResourceListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bookings/new"
        element={
          <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
            <BookingFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets"
        element={
          <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
            <TicketListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/new"
        element={
          <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
            <TicketCreatePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute allowedRoles={["STUDENT", "STAFF", "ADMIN"]}>
            <TicketDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* <Route
        path="/resources/new"
        element={
          <ProtectedRoute allowedRoles={["STAFF", "ADMIN"]}>
            <ResourceFormPage />
          </ProtectedRoute>
        }
      /> */}

      <Route
        path="/admin/resources"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ResourceAdminPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}>
            <BookingListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminNotificationPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRouter;