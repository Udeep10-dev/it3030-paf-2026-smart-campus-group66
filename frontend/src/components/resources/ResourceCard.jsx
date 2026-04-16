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

const ResourceCard = ({ resource }) => {
  const badge = statusStyles[resource.status] || statusStyles.available;

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-100 hover:border-stone-300 hover:shadow-md shadow-sm transition-all duration-200 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <rect
                x="2"
                y="4"
                width="12"
                height="9"
                rx="1.5"
                stroke="#a8a29e"
                strokeWidth="1.2"
              />
              <path
                d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"
                stroke="#a8a29e"
                strokeWidth="1.2"
              />
              <path
                d="M6 9h4M8 7v4"
                stroke="#a8a29e"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-stone-800 leading-tight">
            {resource.name}
          </h2>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badge.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
          {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
        </span>
      </div>

      <div className="border-t border-stone-100 mb-3" />

      <div className="space-y-2">
        {[
          ["Type", resource.type],
          ["Capacity", `${resource.capacity} people`],
          ["Location", resource.location],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            <span className="min-w-[60px] text-stone-400 font-medium">
              {label}
            </span>
            <span className="text-stone-600 font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceCard;
