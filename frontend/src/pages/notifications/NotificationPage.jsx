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

  return (
    <div className="min-h-screen p-6" style={{ background: "#FFF8F3" }}>
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-medium" style={{ color: "#7C3B0A" }}>Notifications</h1>
          {unreadCount > 0 && (
            <span className="text-xs text-white px-2 py-0.5 rounded-full" style={{ background: "#7C3B0A" }}>
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm px-4 py-2 rounded-lg border transition hover:bg-gray-50"
            style={{ color: "#7C3B0A", borderColor: "#7C3B0A" }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading && <p className="text-gray-400 text-sm">Loading notifications...</p>}

      {!loading && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 gap-2">
          <p className="text-gray-400 text-sm">No notifications yet.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {notifications.map(n => (
          <div
            key={n.id}
            className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-start"
            style={{ borderLeft: n.read ? "4px solid #e5e7eb" : "4px solid #7C3B0A" }}
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-800">{n.message}</p>
              <div className="flex gap-2 items-center">
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">{n.type}</span>
                <span className="text-xs text-gray-400">{formatDate(n.createdAt)}</span>
              </div>
            </div>
            {!n.read && (
              <button
                onClick={() => handleMarkAsRead(n.id)}
                className="text-xs px-3 py-1 rounded-lg text-white ml-4 shrink-0"
                style={{ background: "#7C3B0A" }}
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
