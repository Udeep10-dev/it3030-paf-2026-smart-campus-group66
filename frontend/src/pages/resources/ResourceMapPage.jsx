import { useEffect, useRef, useState } from "react";
import resourceService from "../../services/resourceService";
import { Link } from "react-router-dom";

const PIN_POSITIONS = {
  "Building A, Level 1":      { x: 13, y: 12 },
  "Main Building, Level 1":   { x: 38, y: 12 },
  "Block B, 3rd Floor":       { x: 60, y: 12 },
  "New Wing, Floor 4":        { x: 80, y: 14 },
  "Admin Building, B1":       { x: 13, y: 36 },
  "IT Faculty, Level 2":      { x: 38, y: 36 },
  "Main Hall, Floor 4":       { x: 80, y: 36 },
  "Library, 2nd Floor":       { x: 13, y: 60 },
  "Innovation Hub, Level 1":  { x: 38, y: 60 },
  "Media Store, Block A":     { x: 62, y: 60 },
};

const BUILDINGS = [
  { label: "Building A",     x: 3,  y: 5,  w: 22, h: 16, color: "#f5ede0" },
  { label: "Main Building",  x: 28, y: 5,  w: 22, h: 16, color: "#e8f0f5" },
  { label: "Block B",        x: 53, y: 5,  w: 16, h: 16, color: "#ede8f5" },
  { label: "New Wing",       x: 72, y: 5,  w: 16, h: 18, color: "#e8f5ec" },
  { label: "Admin Bldg",     x: 3,  y: 28, w: 22, h: 16, color: "#f5ede0" },
  { label: "IT Faculty",     x: 28, y: 28, w: 22, h: 16, color: "#e8f5ec" },
  { label: "Main Hall",      x: 72, y: 28, w: 16, h: 16, color: "#f5e8e8" },
  { label: "Library",        x: 3,  y: 52, w: 22, h: 16, color: "#ede8f5" },
  { label: "Innovation Hub", x: 28, y: 52, w: 22, h: 16, color: "#e8f0f5" },
  { label: "Media Store",    x: 53, y: 52, w: 16, h: 16, color: "#f5f0e0" },
];

const CATEGORY_ICONS = {
  "Lecture halls": "🏛",
  "Labs": "🔬",
  "Meeting rooms": "🤝",
  "Equipment": "📽",
  "Other": "📦",
};

const STATUS_COLOR = {
  AVAILABLE: { pin: "#16a34a", light: "#dcfce7", text: "#15803d", label: "Available" },
  BOOKED:    { pin: "#dc2626", light: "#fee2e2", text: "#b91c1c", label: "Booked" },
  OUT_OF_SERVICE: { pin: "#d97706", light: "#fef3c7", text: "#b45309", label: "Out of service" },
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
    <div className="min-h-screen p-6" style={{ background: "#FFF8F3" }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-medium" style={{ color: "#7C3B0A" }}>
          Resource Map
        </h1>
        <Link
          to="/resources"
          className="text-sm text-orange-500 hover:underline"
        >
          ← Back to list
        </Link>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <span className="text-sm px-3 py-1 rounded-full bg-white border border-orange-100 text-gray-500">
          <span className="font-medium text-gray-800">{resources.length}</span> resources
        </span>
        <span className="text-sm px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700">
          <span className="font-medium">{totalAvailable}</span> available
        </span>
        <span className="text-sm px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700">
          <span className="font-medium">{totalBooked}</span> booked
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-orange-400 text-sm">
          Loading map...
        </div>
      ) : (
        <>
          {/* Map */}
          <div
            ref={mapRef}
            className="relative w-full rounded-2xl border border-orange-100 overflow-hidden"
            style={{ background: "#f0ebe3", height: 420 }}
            onClick={() => setSelectedLoc(null)}
          >
            {/* SVG campus sketch */}
            <svg
              viewBox="0 0 100 80"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              {/* Roads */}
              <rect x="0" y="24" width="100" height="3" fill="#e2d9cc" rx="1" />
              <rect x="0" y="48" width="100" height="3" fill="#e2d9cc" rx="1" />
              <rect x="26" y="0"  width="3" height="80" fill="#e2d9cc" rx="1" />
              <rect x="51" y="0"  width="3" height="80" fill="#e2d9cc" rx="1" />
              <rect x="70" y="0"  width="3" height="80" fill="#e2d9cc" rx="1" />
              {/* Buildings */}
              {BUILDINGS.map((b) => (
                <g key={b.label}>
                  <rect
                    x={b.x} y={b.y} width={b.w} height={b.h}
                    fill={b.color} rx="1.5"
                    stroke="rgba(0,0,0,0.07)" strokeWidth="0.4"
                  />
                  <text
                    x={b.x + b.w / 2} y={b.y + b.h / 2 + 1.2}
                    textAnchor="middle"
                    fontSize="2.2"
                    fill="rgba(0,0,0,0.35)"
                    fontFamily="sans-serif"
                    fontWeight="500"
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
                    transform: `translate(-50%, -100%) scale(${isSelected ? 1.2 : 1})`,
                    transition: "transform 0.15s",
                    zIndex: isSelected ? 20 : 10,
                  }}
                >
                  <div
                    className="flex items-center justify-center text-white text-xs font-semibold"
                    style={{
                      width: 28, height: 28,
                      borderRadius: "50% 50% 50% 0",
                      transform: "rotate(-45deg)",
                      background: col,
                      border: "2px solid white",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                    }}
                  >
                    <span style={{ transform: "rotate(45deg)", fontSize: 11 }}>
                      {res.length}
                    </span>
                  </div>
                  <span
                    className="text-xs mt-1 px-1.5 py-0.5 rounded-full bg-white border"
                    style={{
                      fontSize: 10, color: "#555",
                      borderColor: "rgba(0,0,0,0.1)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {freeCount} free
                  </span>
                </button>
              );
            })}

            {/* Popup */}
            {selectedLoc && (
              <div
                className="absolute bg-white rounded-xl border border-orange-100 p-3 z-30"
                style={{
                  ...popupStyle,
                  width: 230,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700 leading-tight">
                    📍 {selectedLoc}
                  </span>
                  <button
                    onClick={() => setSelectedLoc(null)}
                    className="text-gray-400 hover:text-gray-600 text-sm leading-none ml-2 mt-0.5"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  {selectedResources.map((r) => {
                    const sc = STATUS_COLOR[r.status] || STATUS_COLOR.OUT_OF_SERVICE;
                    return (
                      <div
                        key={r.id}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-gray-700 truncate mr-2" style={{ maxWidth: 130 }}>
                          {CATEGORY_ICONS[r.category] || "📋"} {r.name}
                        </span>
                        <span
                          className="px-1.5 py-0.5 rounded-full text-xs shrink-0"
                          style={{ background: sc.light, color: sc.text, fontSize: 10 }}
                        >
                          {sc.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <Link
                  to="/resources"
                  className="block mt-3 text-center text-xs py-1.5 rounded-lg text-white font-medium"
                  style={{ background: "#ea580c" }}
                >
                  View all resources ↗
                </Link>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4 flex-wrap">
            {Object.entries(STATUS_COLOR).map(([, sc]) => (
              <div key={sc.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: sc.pin }}
                />
                {sc.label}
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-xs text-gray-400 ml-auto">
              Click a pin to see resources
            </div>
          </div>
        </>
      )}
    </div>
  );
}