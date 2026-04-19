import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAsRead } from "../../services/notificationService";

const typeMeta = {
  BOOKING_APPROVED: { label: "Booking Approved", icon: "✅", accent: "#0d9488" },
  BOOKING_REJECTED: { label: "Booking Rejected", icon: "❌", accent: "#ef4444" },
  TICKET_ASSIGNED:  { label: "Ticket Assigned",  icon: "🎫", accent: "#2563eb" },
  TICKET_UPDATED:   { label: "Ticket Updated",   icon: "🔄", accent: "#f59e0b" },
  GENERAL:          { label: "General",           icon: "📢", accent: "#6366f1" },
};

function getWeekDays() {
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const days = [];
  const labels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - day + i);
    days.push({ label: labels[i], date: d.getDate(), full: d, isToday: i === day });
  }
  return days;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const weekDays = getWeekDays();
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    getNotifications()
      .then(res => setNotifications(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAsRead = (id) => {
    markAsRead(id).then(() =>
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    Promise.all(notifications.filter(n => !n.read).map(n => markAsRead(n.id)))
      .then(() => setNotifications(prev => prev.map(n => ({ ...n, read: true }))));
  };

  const filtered = notifications.filter(n => {
    const matchDay = n.createdAt ? isSameDay(new Date(n.createdAt), selectedDay) : false;
    const matchFilter = filter === "unread" ? !n.read : true;
    return matchDay && matchFilter;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
            >←</button>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Notifications</span>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔔</div>
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, background: "#0ea5e9", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Week calendar strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {weekDays.map((d, i) => {
            const isSelected = isSameDay(d.full, selectedDay);
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(d.full)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "8px 4px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: isSelected ? "#0ea5e9" : "transparent",
                  transition: "all .15s"
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 500, color: isSelected ? "rgba(255,255,255,0.85)" : "#94a3b8", marginBottom: 4 }}>{d.label}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: isSelected ? "#fff" : d.isToday ? "#0ea5e9" : "#1e293b" }}>{d.date}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 0, background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 24px" }}>
        {["all", "unread"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "12px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              border: "none", background: "transparent",
              color: filter === f ? "#0ea5e9" : "#94a3b8",
              borderBottom: filter === f ? "2px solid #0ea5e9" : "2px solid transparent",
              transition: "all .15s"
            }}
          >
            {f === "all" ? "All" : `Unread (${unreadCount})`}
          </button>
        ))}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            style={{ marginLeft: "auto", padding: "12px 0", fontSize: 12, fontWeight: 600, color: "#0ea5e9", border: "none", background: "transparent", cursor: "pointer" }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px", maxWidth: 720, margin: "0 auto" }}>

        {/* Date label */}
        <p style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 12 }}>
          {selectedDay.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>

        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
            <div style={{ width: 28, height: 28, border: "3px solid #e2e8f0", borderTop: "3px solid #0ea5e9", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "48px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 36, margin: "0 0 10px" }}>🔕</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#1e293b" }}>No notifications</p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>Nothing for this day</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(n => {
            const meta = typeMeta[n.type] || typeMeta.GENERAL;
            return (
              <div
                key={n.id}
                style={{
                  background: n.read ? "#fff" : "#f0f9ff",
                  borderRadius: 16,
                  border: "1px solid",
                  borderColor: n.read ? "#e2e8f0" : "#bae6fd",
                  padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: 14,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: "#f1f5f9", border: "1px solid #e2e8f0",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
                }}>
                  {meta.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: n.read ? 400 : 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {n.message}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>
                    {meta.label} · {formatTime(n.createdAt)}
                  </p>
                </div>

                {/* Action */}
                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    style={{
                      flexShrink: 0, fontSize: 12, fontWeight: 600,
                      padding: "7px 14px", borderRadius: 10,
                      border: "1.5px solid #bae6fd", background: "#fff",
                      color: "#0ea5e9", cursor: "pointer", whiteSpace: "nowrap"
                    }}
                  >
                    Mark read
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
