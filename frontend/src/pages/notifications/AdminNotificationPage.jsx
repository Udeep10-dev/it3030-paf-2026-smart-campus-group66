import { useEffect, useState } from "react";
import api from "../../api/axios";

const getToken = () => localStorage.getItem("token");
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

const typeMeta = {
  BOOKING_APPROVED: { label: "Booking Approved", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
  BOOKING_REJECTED: { label: "Booking Rejected", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  TICKET_ASSIGNED:  { label: "Ticket Assigned",  color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
  TICKET_UPDATED:   { label: "Ticket Updated",   color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  GENERAL:          { label: "General",           color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
};

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export default function AdminNotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("GENERAL");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  const fetchAll = () => {
    setLoading(true);
    api.get("/notifications/admin/all", { headers: headers() })
      .then(res => setNotifications(res.data))
      .catch(() => showToast("Failed to load notifications", false))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSend = () => {
    if (!userId || !message) return;
    setSending(true);
    api.post("/notifications/admin/send", { userId: Number(userId), message }, { headers: headers() })
      .then(res => {
        setNotifications(prev => [res.data, ...prev]);
        showToast("Notification sent successfully");
        setUserId(""); setMessage("");
      })
      .catch(() => showToast("Failed to send notification", false))
      .finally(() => setSending(false));
  };

  const filtered = notifications.filter(n =>
    n.message?.toLowerCase().includes(search.toLowerCase()) ||
    n.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    n.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", padding: "22px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔔</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.2px" }}>Notification Center</h1>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 400 }}>Smart Campus · Admin Panel</p>
          </div>
        </div>
        <button
          onClick={fetchAll}
          style={{ fontSize: 13, padding: "7px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 500, backdropFilter: "blur(4px)" }}
        >
          ↻ Refresh
        </button>
      </div>

      <div style={{ padding: "28px 36px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Toast */}
        {toast && (
          <div style={{ marginBottom: 16, padding: "12px 18px", borderRadius: 10, background: toast.ok ? "#ecfdf5" : "#fef2f2", border: `1px solid ${toast.ok ? "#a7f3d0" : "#fecaca"}`, color: toast.ok ? "#065f46" : "#991b1b", fontSize: 13, fontWeight: 500 }}>
            {toast.ok ? "✓ " : "✕ "}{toast.msg}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Sent",  value: notifications.length, accent: "#6366f1", bg: "#eef2ff", icon: "📨" },
            { label: "Unread",      value: unread,                accent: "#f59e0b", bg: "#fffbeb", icon: "🔴" },
            { label: "Read",        value: notifications.length - unread, accent: "#10b981", bg: "#ecfdf5", icon: "✅" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
              <div>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: s.accent, lineHeight: 1 }}>{s.value}</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b", fontWeight: 500 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Send form */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "22px 24px", marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <p style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
            Send New Notification
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <input
              style={{ height: 38, padding: "0 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, color: "#0f172a", outline: "none", width: 100, background: "#f8fafc" }}
              placeholder="User ID"
              value={userId}
              onChange={e => setUserId(e.target.value)}
            />
            <input
              style={{ height: 38, padding: "0 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, color: "#0f172a", outline: "none", flex: 1, minWidth: 220, background: "#f8fafc" }}
              placeholder="Type your message here..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button
              onClick={handleSend}
              disabled={sending || !userId || !message}
              style={{ height: 38, padding: "0 22px", borderRadius: 8, border: "none", background: sending || !userId || !message ? "#bfdbfe" : "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: sending || !userId || !message ? "not-allowed" : "pointer", transition: "opacity .2s" }}
            >
              {sending ? "Sending..." : "Send →"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
              All Notifications
              <span style={{ marginLeft: 8, fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>{filtered.length} records</span>
            </p>
            <input
              style={{ height: 34, padding: "0 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, color: "#0f172a", outline: "none", width: 220, background: "#f8fafc" }}
              placeholder="Search message, name, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
              <div style={{ width: 28, height: 28, border: "3px solid #e2e8f0", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ fontSize: 40, margin: "0 0 8px" }}>📭</p>
              <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>No notifications found</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["#", "Recipient", "Message", "Type", "Status", "Date"].map(h => (
                    <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((n, i) => {
                  const meta = typeMeta[n.type] || typeMeta.GENERAL;
                  return (
                    <tr key={n.id} style={{ borderBottom: "1px solid #f8fafc", transition: "background .15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 20px", color: "#cbd5e1", fontFamily: "monospace", fontSize: 12 }}>{n.id}</td>
                      <td style={{ padding: "12px 20px" }}>
                        <p style={{ margin: 0, fontWeight: 600, color: "#1e293b", fontSize: 13 }}>{n.user?.name || "—"}</p>
                        <p style={{ margin: "2px 0 0", color: "#94a3b8", fontSize: 12 }}>{n.user?.email || "—"}</p>
                      </td>
                      <td style={{ padding: "12px 20px", color: "#475569", maxWidth: 260 }}>
                        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.message}</span>
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
                          {meta.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        {n.read
                          ? <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "#f1f5f9", color: "#94a3b8", border: "1px solid #e2e8f0" }}>Read</span>
                          : <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" }}>● Unread</span>
                        }
                      </td>
                      <td style={{ padding: "12px 20px", color: "#94a3b8", fontSize: 12 }}>{fmt(n.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
