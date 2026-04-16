const statusStyles = {
  available: {
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-400",
  },
  booked: {
    badge: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    dot: "bg-sky-400",
  },
  maintenance: {
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-400",
  },
};

const icons = {
  Type: (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="2"
        width="5"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="9"
        y="2"
        width="5"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="2"
        y="9"
        width="5"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="9"
        y="9"
        width="5"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  ),
  Capacity: (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle
        cx="11.5"
        cy="5"
        r="1.8"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M13.5 13c0-1.7-1-3-2.5-3.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Location: (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
};

const ResourceCard = ({ resource, onBook }) => {
  const badge = statusStyles[resource.status] || statusStyles.available;
  const isAvailable = resource.status === "AVAILABLE";

  return (
    <div className="bg-white rounded-2xl border border-stone-100 hover:border-stone-200 hover:shadow-lg shadow-sm transition-all duration-200 cursor-pointer group overflow-hidden">
      {/* Top accent bar */}
      <div className={`h-1 w-full bg-amber-400`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center group-hover:bg-stone-100 transition-colors flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect
                  x="2"
                  y="4"
                  width="12"
                  height="9"
                  rx="1.5"
                  stroke="#78716c"
                  strokeWidth="1.2"
                />
                <path
                  d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"
                  stroke="#78716c"
                  strokeWidth="1.2"
                />
                <path
                  d="M5.5 9.5h5M8 7.5v4"
                  stroke="#78716c"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-800 leading-tight">
                {resource.name}
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">{resource.type}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badge.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
          </span>
        </div>

        <div className="flex justify-between">
          <div className="bg-stone-50 rounded-xl p-3 space-y-2 w-full">
            {[
              ["Capacity", `${resource.capacity} people`],
              ["Location", resource.location],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center gap-2.5 text-xs">
                <span className="text-stone-400 flex-shrink-0">
                  {icons[label]}
                </span>
                <span className="text-stone-400 font-medium min-w-[56px]">
                  {label}
                </span>
                <span className="text-stone-600 font-semibold">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center w-full">
            <button
              onClick={() => onBook?.(resource)}
              disabled={!isAvailable}
              className={`w-full h-9 rounded-xl text-xs font-bold transition-all duration-150
            ${
              isAvailable
                ? "bg-amber-500 text-white hover:bg-amber-600 active:scale-95 shadow-sm"
                : "bg-stone-100 text-stone-400 cursor-not-allowed"
            }`}
            >
              {isAvailable
                ? "Book now"
                : resource.status === "booked"
                  ? "Already booked"
                  : "Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
