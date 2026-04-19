import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAsRead } from "../../services/notificationService";

const typeMeta = {
  BOOKING_APPROVED: { label: "Booking Approved", color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", icon: "✅" },
  BOOKING_REJECTED: { label: "Booking Rejected", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", icon: "❌" },
  TICKET_ASSIGNED:  { label: "Ticket Assigned",  color: "#2563eb", bg: "#eff6ff", border: "#93c5fd", icon: "🎫" },
  TICKET_UPDATED:   { label: "Ticket Updated",   color: "#d97706", bg: "#fffbeb", border: "#fcd34d", icon: "🔄" },
  GENERAL:          { label: "General",           color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", icon: "📢" },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

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

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === "unread" ? notifications.filter(n => !n.read) : notifications;

  return (
    <div style={{ minHeight: "100vh", background: "#dbeafe", fontFamily: "'Inter', sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)",
        padding: "28px 28px 60px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* decorative blobs */}
        <div style={{ position: "absolute", top: -50, right: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", bottom: -30, left: "40%", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 8, padding: "6px 14px", color: "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            marginBottom: 20, backdropFilter: "blur(6px)",
            letterSpacing: "0.01em"
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>←</span> Back
        </button>

        {/* Title row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
                What's New
              </h1>
              {unreadCount > 0 && (
                <span style={{ fontSize: 11, fontWeight: 700, background: "#f59e0b", color: "#fff", borderRadius: 20, padding: "3px 10px" }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>
              Your latest updates, all in one place
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              style={{
                fontSize: 13, padding: "8px 16px", borderRadius: 9,
                border: "1px solid rgba(255,255,255,0.35)",
                background: "rgba(255,255,255,0.15)",
                color: "#fff", fontWeight: 600, cursor: "pointer",
                backdropFilter: "blur(6px)"
              }}
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 24, position: "relative" }}>
          {[
            { label: "Total",  value: notifications.length, icon: "📨" },
            { label: "Unread", value: unreadCount,           icon: "🔵" },
            { label: "Read",   value: notifications.length - unreadCount, icon: "✔️" },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 14, padding: "14px 18px",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#fff" }}>{s.value}</p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{s.icon} {s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "-24px auto 0", padding: "0 20px 40px", position: "relative" }}>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["all", "unread"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontSize: 13, padding: "8px 20px", borderRadius: 10, fontWeight: 600, cursor: "pointer",
                border: "1.5px solid",
                borderColor: filter === f ? "#1e40af" : "#bfdbfe",
                background: filter === f ? "#1e40af" : "#eff6ff",
                color: filter === f ? "#fff" : "#1e40af",
                boxShadow: filter === f ? "0 4px 12px rgba(30,64,175,0.2)" : "none",
                transition: "all .15s"
              }}
            >
              {f === "all" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: 30, height: 30, border: "3px solid #bfdbfe", borderTop: "3px solid #1e40af", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #bfdbfe", padding: "56px 24px", textAlign: "center", boxShadow: "0 4px 20px rgba(30,64,175,0.08)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔕</div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e3a5f" }}>All caught up!</p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>No {filter === "unread" ? "unread " : ""}notifications right now</p>
          </div>
        )}

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(n => {
            const meta = typeMeta[n.type] || typeMeta.GENERAL;
            return (
              <div key={n.id} style={{
                background: "#fff",
                borderRadius: 16,
                border: `1px solid ${n.read ? "#dbeafe" : "#93c5fd"}`,
                borderLeft: `4px solid ${n.read ? "#93c5fd" : "#1e40af"}`,
                padding: "16px 18px",
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                boxShadow: n.read ? "0 1px 4px rgba(30,64,175,0.05)" : "0 4px 16px rgba(30,64,175,0.1)",
                opacity: n.read ? 0.75 : 1,
                transition: "all .2s"
              }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: meta.bg, border: `1px solid ${meta.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0
                  }}>
                    {meta.icon}
                  </div>
                  <div>
                    <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: n.read ? 400 : 600, color: n.read ? "#64748b" : "#0f172a", lineHeight: 1.5 }}>
                      {n.message}
                    </p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                        {meta.label}
                      </span>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{formatDate(n.createdAt)}</span>
                      {!n.read && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1e40af", display: "inline-block" }} /> New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    style={{
                      fontSize: 12, padding: "6px 14px", borderRadius: 8,
                      border: "1.5px solid #93c5fd", background: "#eff6ff",
                      color: "#1e40af", fontWeight: 600, cursor: "pointer",
                      marginLeft: 12, whiteSpace: "nowrap", flexShrink: 0
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

export default NotificationPage;
