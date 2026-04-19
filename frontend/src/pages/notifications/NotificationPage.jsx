import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const getToken = () => localStorage.getItem("token");
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

const typeMeta = {
  BOOKING_APPROVED: { label: "Booking Approved", color: "#fff", bg: "linear-gradient(135deg,#10b981,#059669)", icon: "✅" },
  BOOKING_REJECTED: { label: "Booking Rejected", color: "#fff", bg: "linear-gradient(135deg,#ef4444,#dc2626)", icon: "❌" },
  TICKET_ASSIGNED:  { label: "Ticket Assigned",  color: "#fff", bg: "linear-gradient(135deg,#3b82f6,#2563eb)", icon: "🎫" },
  TICKET_UPDATED:   { label: "Ticket Updated",   color: "#fff", bg: "linear-gradient(135deg,#f59e0b,#d97706)", icon: "🔄" },
  GENERAL:          { label: "General",           color: "#fff", bg: "linear-gradient(135deg,#8b5cf6,#7c3aed)", icon: "📢" },
};

const toDateKey = (d) => { const dt = new Date(d); return dt.getFullYear() + "-" + dt.getMonth() + "-" + dt.getDate(); };
const fmt = (d) => d ? new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "";
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function MiniCalendar({ notifications, selectedDate, onSelect }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const dotDays = new Set(notifications.map(n => n.createdAt ? toDateKey(n.createdAt) : null).filter(Boolean));
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prev = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const next = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ background: "#1e1b4b", borderRadius: 20, padding: "20px 18px", width: 260, flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={prev} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 14 }}>prev</button>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={next} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 14 }}>next</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 8 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={"e" + i} />;
          const key = viewYear + "-" + viewMonth + "-" + day;
          const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
          const hasDot = dotDays.has(key);
          const isSelected = selectedDate && toDateKey(selectedDate) === key;
          return (
            <div key={key}
              onClick={() => onSelect(isSelected ? null : new Date(viewYear, viewMonth, day))}
              style={{
                position: "relative", textAlign: "center", padding: "6px 0", borderRadius: 8, fontSize: 12,
                fontWeight: isToday ? 800 : 400, cursor: hasDot ? "pointer" : "default",
                background: isSelected ? "linear-gradient(135deg,#818cf8,#6366f1)" : isToday ? "rgba(255,255,255,0.15)" : "transparent",
                color: isSelected || isToday ? "#fff" : "rgba(255,255,255,0.7)"
              }}>
              {day}
              {hasDot && (
                <span style={{ position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: isSelected ? "#fff" : "#818cf8", display: "block" }} />
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Summary</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#818cf8" }}>{notifications.length}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Total</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#f59e0b" }}>{notifications.filter(n => !n.read).length}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Unread</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#10b981" }}>{notifications.filter(n => n.read).length}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Read</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/notifications", { headers: headers() })
      .then(res => setNotifications(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = (id) => {
    api.patch("/notifications/" + id + "/read", {}, { headers: headers() })
      .then(res => setNotifications(prev => prev.map(n => n.id === id ? res.data : n)))
      .catch(console.error);
  };

  const markAllRead = () => notifications.filter(n => !n.read).forEach(n => markAsRead(n.id));
  const unread = notifications.filter(n => !n.read).length;
  const filtered = selectedDate
    ? notifications.filter(n => n.createdAt && toDateKey(n.createdAt) === toDateKey(selectedDate))
    : notifications;
  const grouped = filtered.reduce((acc, n) => {
    const key = fmtDate(n.createdAt);
    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {});

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0f0c29,#302b63,#24243e)", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ padding: "32px 40px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(129,140,248,0.15)", pointerEvents: "none" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => navigate("/dashboard")} style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              back
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#818cf8,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 4px 20px rgba(99,102,241,0.5)" }}>N</div>
              <div>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>Notifications</h1>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Smart Campus - Your activity feed</p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {unread > 0 && (
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", color: "#fbbf24", fontSize: 12, fontWeight: 700 }}>{unread} unread</div>
                <button onClick={markAllRead} style={{ padding: "6px 16px", borderRadius: 20, background: "rgba(129,140,248,0.2)", border: "1px solid rgba(129,140,248,0.4)", color: "#a5b4fc", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Mark all read</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 40px 40px", display: "flex", gap: 24, alignItems: "flex-start", maxWidth: 1200, margin: "0 auto" }}>
        <MiniCalendar notifications={notifications} selectedDate={selectedDate} onSelect={setSelectedDate} />
        <div style={{ flex: 1 }}>
          {selectedDate && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "7px 14px", borderRadius: 20, background: "rgba(129,140,248,0.2)", border: "1px solid rgba(129,140,248,0.35)", color: "#a5b4fc", fontSize: 13, fontWeight: 600 }}>
              {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              <span onClick={() => setSelectedDate(null)} style={{ cursor: "pointer", opacity: 0.6, fontSize: 12 }}>x</span>
            </div>
          )}
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
              <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #818cf8", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>moon</div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 16, margin: 0 }}>{selectedDate ? "Nothing on this day" : "You are all caught up"}</p>
            </div>
          ) : (
            Object.entries(grouped).map(([date, items]) => (
              <div key={date} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{date}</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{items.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.map(n => {
                    const meta = typeMeta[n.type] || typeMeta.GENERAL;
                    return (
                      <div key={n.id}
                        style={{ borderRadius: 16, overflow: "hidden", background: n.read ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)", border: n.read ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(129,140,248,0.3)", display: "flex", transition: "transform .15s" }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
                        <div style={{ width: 4, background: meta.bg, flexShrink: 0 }} />
                        <div style={{ flex: 1, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 42, height: 42, borderRadius: 12, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{meta.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: meta.bg, color: meta.color }}>{meta.label}</span>
                              {!n.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8", display: "inline-block" }} />}
                            </div>
                            <p style={{ margin: 0, fontSize: 14, color: n.read ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>{n.message}</p>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{fmt(n.createdAt)}</span>
                            {!n.read && (
                              <button onClick={() => markAsRead(n.id)} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(129,140,248,0.4)", background: "rgba(129,140,248,0.15)", color: "#a5b4fc", cursor: "pointer", fontWeight: 600 }}>Mark read</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}

export default NotificationPage;
