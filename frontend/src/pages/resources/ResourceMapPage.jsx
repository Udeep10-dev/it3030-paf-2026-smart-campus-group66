import { useEffect, useRef, useState } from "react";
import resourceService from "../../services/resourceService";
import { Link } from "react-router-dom";

const PIN_POSITIONS = {
  "Building A, Level 1":       { x: 13, y: 12 },
  "Main Building, Level 1":   { x: 38, y: 12 },
  "Block B, 3rd Floor":        { x: 60, y: 12 },
  "New Wing, Floor 4":         { x: 80, y: 14 },
  "Admin Building, B1":        { x: 13, y: 36 },
  "IT Faculty, Level 2":       { x: 38, y: 36 },
  "Main Hall, Floor 4":        { x: 80, y: 36 },
  "Library, 2nd Floor":        { x: 13, y: 60 },
  "Innovation Hub, Level 1":   { x: 38, y: 60 },
  "Media Store, Block A":      { x: 62, y: 60 },
};

const BUILDINGS = [
  { label: "Building A",     x: 3,  y: 5,  w: 22, h: 16, color: "#EBFBFA" }, // Light Teal
  { label: "Main Building",  x: 28, y: 5,  w: 22, h: 16, color: "#E9F2FE" }, // Light Blue
  { label: "Block B",         x: 53, y: 5,  w: 16, h: 16, color: "#F1F5F9" },
  { label: "New Wing",       x: 72, y: 5,  w: 16, h: 18, color: "#EBFBFA" },
  { label: "Admin Bldg",     x: 3,  y: 28, w: 22, h: 16, color: "#E9F2FE" },
  { label: "IT Faculty",     x: 28, y: 28, w: 22, h: 16, color: "#EBFBFA" },
  { label: "Main Hall",      x: 72, y: 28, w: 16, h: 16, color: "#F1F5F9" },
  { label: "Library",        x: 3,  y: 52, w: 22, h: 16, color: "#E9F2FE" },
  { label: "Innovation Hub", x: 28, y: 52, w: 22, h: 16, color: "#EBFBFA" },
  { label: "Media Store",    x: 53, y: 52, w: 16, h: 16, color: "#F1F5F9" },
];

const CATEGORY_ICONS = {
  "Lecture halls": "🏛",
  "Labs": "🔬",
  "Meeting rooms": "🤝",
  "Equipment": "📽",
  "Other": "📦",
};

const STATUS_COLOR = {
  AVAILABLE: { pin: "#4FD1C5", light: "#DFF8F6", text: "#0F766E", label: "Available" },
  BOOKED:    { pin: "#2F80ED", light: "#E9F2FE", text: "#123A7A", label: "Booked" },
  OUT_OF_SERVICE: { pin: "#94A3B8", light: "#F1F5F9", text: "#475569", label: "Out of service" },
};

export default function ResourceMapPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [popupStyle, setPopupStyle] = useState({});
  const mapRef = useRef(null);

  useEffect(() => {
    resourceService.getAll().then((res) => {
      setResources(res.data);
      setLoading(false);
    });
  }, []);

  const byLoc = resources.reduce((acc, r) => {
    if (!acc[r.location]) acc[r.location] = [];
    acc[r.location].push(r);
    return acc;
  }, {});

  function pinColor(res) {
    if (res.every((r) => r.status === "BOOKED")) return STATUS_COLOR.BOOKED.pin;
    if (res.some((r) => r.status === "AVAILABLE")) return STATUS_COLOR.AVAILABLE.pin;
    return STATUS_COLOR.OUT_OF_SERVICE.pin;
  }

  function handlePinClick(e, loc) {
    e.stopPropagation();
    if (selectedLoc === loc) { setSelectedLoc(null); return; }
    const map = mapRef.current;
    if (!map) { setSelectedLoc(loc); return; }
    const mapRect = map.getBoundingClientRect();
    const pinRect = e.currentTarget.getBoundingClientRect();
    const pinCenterX = pinRect.left - mapRect.left + pinRect.width / 2;
    const pinTopY = pinRect.top - mapRect.top;
    const popupW = 230;
    let left = pinCenterX - popupW / 2;
    if (left < 8) left = 8;
    if (left + popupW > mapRect.width - 8) left = mapRect.width - popupW - 8;
    setPopupStyle({ left, top: Math.max(8, pinTopY - 10) });
    setSelectedLoc(loc);
  }

  const selectedResources = selectedLoc ? byLoc[selectedLoc] || [] : [];
  const totalAvailable = resources.filter((r) => r.status === "AVAILABLE").length;
  const totalBooked = resources.filter((r) => r.status === "BOOKED").length;

  return (
    <div className="min-h-screen p-6 bg-white">
      {/* Decorative Background Circles like Hero */}
      <div className="absolute left-0 top-0 h-32 w-32 rounded-br-full bg-[#4FD1C5]/10 pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-6">
        <div>
           <p className="mb-2 inline-block rounded-full bg-[#DFF8F6] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0F766E]">
             Smart Campus Map
           </p>
           <h1 className="text-3xl font-extrabold text-[#123A7A]">
             Resource Map
           </h1>
        </div>
        <Link
          to="/resources"
          className="flex items-center gap-2 rounded-full border border-[#123A7A] px-5 py-2 text-sm font-bold text-[#123A7A] transition hover:bg-[#123A7A] hover:text-white"
        >
          ← Back to list
        </Link>
      </div>

      {/* Stats row */}
      <div className="relative z-10 flex gap-3 mb-8 flex-wrap">
        <span className="text-xs px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-medium">
          {resources.length} Total Resources
        </span>
        <span className="text-xs px-4 py-1.5 rounded-full bg-[#DFF8F6] border border-[#4FD1C5]/30 text-[#0F766E] font-bold">
          {totalAvailable} Available
        </span>
        <span className="text-xs px-4 py-1.5 rounded-full bg-[#E9F2FE] border border-[#2F80ED]/30 text-[#123A7A] font-bold">
          {totalBooked} Booked
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-[#4FD1C5] font-medium italic">
          Loading smart map...
        </div>
      ) : (
        <div className="relative z-10">
          {/* Map Container */}
          <div
            ref={mapRef}
            className="relative w-full rounded-[32px] border border-slate-200 overflow-hidden shadow-xl"
            style={{ background: "#F8FAFC", height: 450 }}
            onClick={() => setSelectedLoc(null)}
          >
            {/* SVG campus sketch */}
            <svg
              viewBox="0 0 100 80"
              className="absolute inset-0 w-full h-full opacity-60"
              preserveAspectRatio="none"
            >
              {/* Roads - Neutral Grey */}
              <rect x="0" y="24" width="100" height="2" fill="#E2E8F0" rx="1" />
              <rect x="0" y="48" width="100" height="2" fill="#E2E8F0" rx="1" />
              <rect x="26" y="0"  width="2" height="80" fill="#E2E8F0" rx="1" />
              <rect x="51" y="0"  width="2" height="80" fill="#E2E8F0" rx="1" />
              <rect x="70" y="0"  width="2" height="80" fill="#E2E8F0" rx="1" />
              
              {/* Buildings */}
              {BUILDINGS.map((b) => (
                <g key={b.label}>
                  <rect
                    x={b.x} y={b.y} width={b.w} height={b.h}
                    fill={b.color} rx="3"
                    stroke="#CBD5E1" strokeWidth="0.2"
                  />
                  <text
                    x={b.x + b.w / 2} y={b.y + b.h / 2 + 1.2}
                    textAnchor="middle"
                    fontSize="2.5"
                    fill="#64748B"
                    fontFamily="sans-serif"
                    fontWeight="600"
                  >
                    {b.label}
                  </text>
                </g>
              ))}
            </svg>

            {/* Pins */}
            {Object.entries(byLoc).map(([loc, res]) => {
              const pos = PIN_POSITIONS[loc];
              if (!pos) return null;
              const col = pinColor(res);
              const freeCount = res.filter((r) => r.status === "AVAILABLE").length;
              const isSelected = selectedLoc === loc;
              return (
                <button
                  key={loc}
                  onClick={(e) => handlePinClick(e, loc)}
                  className="absolute flex flex-col items-center focus:outline-none"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: `translate(-50%, -100%) scale(${isSelected ? 1.25 : 1})`,
                    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    zIndex: isSelected ? 40 : 10,
                  }}
                >
                  <div
                    className="flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      width: 30, height: 30,
                      borderRadius: "50% 50% 50% 0",
                      transform: "rotate(-45deg)",
                      background: col,
                      border: "2px solid white",
                      boxShadow: isSelected ? "0 8px 15px rgba(0,0,0,0.2)" : "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    <span style={{ transform: "rotate(45deg)", fontSize: 11 }}>
                      {res.length}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col items-center">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-slate-200 text-[9px] font-bold text-slate-700 shadow-sm">
                      {freeCount} available
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Popup - Styled like Hero Card */}
            {selectedLoc && (
              <div
                className="absolute bg-white rounded-[24px] border border-slate-100 p-4 z-50 animate-in fade-in zoom-in duration-200"
                style={{
                  ...popupStyle,
                  width: 240,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold text-[#123A7A] flex items-center gap-1">
                    📍 {selectedLoc}
                  </span>
                  <button
                    onClick={() => setSelectedLoc(null)}
                    className="h-5 w-5 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedResources.map((r) => {
                    const sc = STATUS_COLOR[r.status] || STATUS_COLOR.OUT_OF_SERVICE;
                    return (
                      <div
                        key={r.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <span className="text-[11px] font-medium text-slate-700 truncate mr-2">
                          {CATEGORY_ICONS[r.category] || "📋"} {r.name}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0"
                          style={{ background: sc.light, color: sc.text }}
                        >
                          {sc.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <Link
                  to="/resources"
                  className="mt-4 block w-full text-center text-xs py-2.5 rounded-xl text-white font-bold bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] shadow-md hover:opacity-90 transition active:scale-95"
                >
                  Explore All ↗
                </Link>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex gap-6 mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 w-fit">
            {Object.entries(STATUS_COLOR).map(([, sc]) => (
              <div key={sc.label} className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <div
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{ background: sc.pin }}
                />
                {sc.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}