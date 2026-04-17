import { useEffect, useState } from "react";
import { getNotifications, markAsRead } from "../../services/notificationService";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(res => setNotifications(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAsRead = (id) => {
    markAsRead(id).then(() => {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    });
  };

  const handleMarkAllAsRead = () => {
    const unread = notifications.filter(n => !n.read);
    Promise.all(unread.map(n => markAsRead(n.id))).then(() => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString();
  };

  const typeColors = {
    BOOKING_APPROVED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    BOOKING_REJECTED: "bg-red-50 text-red-700 ring-1 ring-red-200",
    TICKET_ASSIGNED: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    TICKET_UPDATED: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    GENERAL: "bg-stone-50 text-stone-600 ring-1 ring-stone-200",
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#FFF8F3" }}>
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-medium" style={{ color: "#7C3B0A" }}>Notifications</h1>
          {unreadCount > 0 && (
            <span className="text-xs font-semibold text-white px-2.5 py-0.5 rounded-full bg-orange-500">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm px-4 py-2 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 transition font-semibold text-orange-900 active:scale-95"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center mt-20">
          <span className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-10 text-center">
          <p className="text-stone-400 text-sm">No notifications yet.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {notifications.map(n => (
          <div
            key={n.id}
            className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex justify-between items-start hover:border-orange-200 transition-all"
            style={{ borderLeft: n.read ? "" : "4px solid #f97316" }}
          >
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-stone-800">{n.message}</p>
              <div className="flex gap-2 items-center flex-wrap">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${typeColors[n.type] || typeColors.GENERAL}`}>
                  {n.type?.replace(/_/g, " ")}
                </span>
                <span className="text-xs text-stone-400">{formatDate(n.createdAt)}</span>
              </div>
            </div>
            {!n.read && (
              <button
                onClick={() => handleMarkAsRead(n.id)}
                className="text-xs px-3 py-1.5 rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition ml-4 shrink-0 font-semibold active:scale-95"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationPage;
