import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../../services/notificationService";

function NotificationToast() {
  const [toast, setToast] = useState(null);
  const [prevCount, setPrevCount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const check = () => {
      getNotifications()
        .then(res => {
          const unread = res.data.filter(n => !n.read);
          if (prevCount !== null && unread.length > prevCount) {
            const newest = unread[0];
            setToast(newest);
            setTimeout(() => setToast(null), 5000);
          }
          setPrevCount(unread.length);
        })
        .catch(() => {});
    };

    check();
    const interval = setInterval(check, 15000); // poll every 15 seconds
    return () => clearInterval(interval);
  }, [prevCount]);

  if (!toast) return null;

  return (
    <div
      onClick={() => { navigate("/notifications"); setToast(null); }}
      className="fixed bottom-6 right-6 z-50 bg-white border border-orange-200 rounded-2xl shadow-lg p-4 flex items-start gap-3 cursor-pointer hover:shadow-xl transition-all w-80"
    >
      <span className="text-2xl">🔔</span>
      <div>
        <p className="text-sm font-semibold text-stone-800">{toast.message}</p>
        <p className="text-xs text-orange-500 mt-0.5">{toast.type?.replace(/_/g, " ")}</p>
        <p className="text-xs text-stone-400 mt-1">Click to view notifications</p>
      </div>
      <button
        onClick={e => { e.stopPropagation(); setToast(null); }}
        className="text-stone-300 hover:text-stone-500 ml-auto text-lg leading-none"
      >×</button>
    </div>
  );
}

export default NotificationToast;
