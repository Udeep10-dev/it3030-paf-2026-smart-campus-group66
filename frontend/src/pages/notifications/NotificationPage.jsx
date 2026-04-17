import { useEffect, useState } from "react";
import { getNotifications, markAsRead } from "../../services/notificationService";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications()
      .then(res => setNotifications(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleMarkAsRead = (id) => {
    markAsRead(id).then(() => {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    });
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#FFF8F3" }}>
      <h1 className="text-2xl font-medium mb-5" style={{ color: "#7C3B0A" }}>Notifications</h1>
      {notifications.length === 0 && (
        <p className="text-gray-400 text-sm">No notifications yet.</p>
      )}
      <div className="flex flex-col gap-3">
        {notifications.map(n => (
          <div
            key={n.id}
            className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center"
            style={{ opacity: n.read ? 0.6 : 1 }}
          >
            <div>
              <p className="text-sm font-medium text-gray-800">{n.message}</p>
              <span className="text-xs text-gray-400">{n.type}</span>
            </div>
            {!n.read && (
              <button
                onClick={() => handleMarkAsRead(n.id)}
                className="text-xs px-3 py-1 rounded-lg text-white"
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
