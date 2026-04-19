import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAsRead } from "../../services/notificationService";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getNotifications()
      .then(res => setNotifications(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const recent = notifications.slice(0, 5);

  const handleMarkAsRead = (id) => {
    markAsRead(id).then(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-orange-50 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#7C3B0A" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 text-xs text-white rounded-full flex items-center justify-center" style={{ background: "#7C3B0A" }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <span className="text-sm font-medium" style={{ color: "#7C3B0A" }}>Notifications</span>
            <button onClick={() => navigate("/notifications")} className="text-xs text-gray-400 hover:underline">View all</button>
          </div>
          {recent.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">No notifications</p>
          )}
          {recent.map(n => (
            <div key={n.id} className="flex justify-between items-start px-4 py-3 border-b hover:bg-gray-50"
              style={{ borderLeft: n.read ? "3px solid transparent" : "3px solid #7C3B0A" }}>
              <div>
                <p className="text-xs text-gray-700">{n.message}</p>
                <p className="text-xs text-gray-400">{n.type}</p>
              </div>
              {!n.read && (
                <button onClick={() => handleMarkAsRead(n.id)} className="text-xs text-orange-700 ml-2 shrink-0">✓</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
