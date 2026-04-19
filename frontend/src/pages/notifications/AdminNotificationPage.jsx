import { useEffect, useState } from "react";
import api from "../../api/axios";

const getToken = () => localStorage.getItem("token");
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

const typeBadge = {
  BOOKING_APPROVED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  BOOKING_REJECTED: "bg-red-100 text-red-700 border border-red-200",
  TICKET_ASSIGNED: "bg-blue-100 text-blue-700 border border-blue-200",
  TICKET_UPDATED: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  GENERAL: "bg-slate-100 text-slate-600 border border-slate-200",
};

export default function AdminNotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("GENERAL");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchAll = () => {
    setLoading(true);
    api.get("/api/notifications/admin/all", { headers: headers() })
      .then(res => setNotifications(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSend = () => {
    if (!userId || !message) return;
    setSending(true);
    api.post("/api/notifications/admin/send", { userId: Number(userId), message }, { headers: headers() })
      .then(res => {
        setNotifications(prev => [res.data, ...prev]);
        showToast("✓ Notification sent successfully");
        setUserId(""); setMessage("");
      })
      .finally(() => setSending(false));
  };

  const filtered = notifications.filter(n =>
    n.message?.toLowerCase().includes(search.toLowerCase()) ||
    n.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    n.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen" style={{ background: "#0F172A" }}>

      {/* Top bar */}
      <div className="border-b border-slate-700 px-8 py-4 flex justify-between items-center" style={{ background: "#1E293B" }}>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">🔔 Notification Center</h1>
          <p className="text-slate-400 text-xs mt-0.5">Smart Campus · Admin Panel</p>
        </div>
        <button onClick={fetchAll} className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition flex items-center gap-1.5">
          ↻ Refresh
        </button>
      </div>

      <div className="px-8 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Sent", value: notifications.length, color: "text-white", border: "border-slate-700" },
            { label: "Unread", value: unread, color: "text-orange-400", border: "border-orange-900" },
            { label: "Read", value: notifications.length - unread, color: "text-emerald-400", border: "border-emerald-900" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border ${s.border} p-4`} style={{ background: "#1E293B" }}>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-slate-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Send form */}
        <div className="rounded-xl border border-slate-700 p-5" style={{ background: "#1E293B" }}>
          <p className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" /> Send New Notification
          </p>
          <div className="flex gap-3 flex-wrap">
            <input
              className="h-9 px-3 rounded-lg text-sm bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 w-24"
              placeholder="User ID"
              value={userId}
              onChange={e => setUserId(e.target.value)}
            />
            <input
              className="h-9 px-3 rounded-lg text-sm bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 flex-1 min-w-48"
              placeholder="Type your message here..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button
              onClick={handleSend}
              disabled={sending || !userId || !message}
              className="h-9 px-5 rounded-lg text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition disabled:opacity-40 active:scale-95"
            >
              {sending ? "Sending..." : "Send →"}
            </button>
          </div>
          {toast && <p className="text-emerald-400 text-xs mt-2">{toast}</p>}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-700 overflow-hidden" style={{ background: "#1E293B" }}>
          <div className="flex justify-between items-center px-5 py-3 border-b border-slate-700">
            <p className="text-white font-semibold text-sm">All Notifications
              <span className="ml-2 text-xs text-slate-400 font-normal">{filtered.length} records</span>
            </p>
            <input
              className="h-8 px-3 rounded-lg text-xs bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 w-52"
              placeholder="Search message, name, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <span className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-2">📭</p>
              <p className="text-slate-400 text-sm">No notifications found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-700">
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Recipient</th>
                  <th className="px-5 py-3 text-left">Message</th>
                  <th className="px-5 py-3 text-left">Type</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(n => (
                  <tr key={n.id} className="border-t border-slate-700/50 hover:bg-slate-700/30 transition">
                    <td className="px-5 py-3 text-slate-500 font-mono text-xs">{n.id}</td>
                    <td className="px-5 py-3">
                      <p className="text-white text-xs font-medium">{n.user?.name || "—"}</p>
                      <p className="text-slate-500 text-xs">{n.user?.email || "—"}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-300 text-xs max-w-xs truncate">{n.message}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeBadge[n.type] || typeBadge.GENERAL}`}>
                        {n.type?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${n.read ? "bg-slate-700 text-slate-400" : "bg-orange-500/20 text-orange-400 border border-orange-500/30"}`}>
                        {n.read ? "Read" : "● Unread"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
