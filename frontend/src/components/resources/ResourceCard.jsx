import React from "react";

const statusStyles = {
  ACTIVE: {
    badge: "bg-[#E6FFFA] text-[#0F766E] border-[#B2F5EA]",
    dot: "bg-[#4FD1C5]",
    label: "Available",
  },
  OUT_OF_SERVICE: {
    badge: "bg-slate-50 text-slate-500 border-slate-100",
    dot: "bg-slate-300",
    label: "Full / Maintenance",
  },
};

const icons = {
  Capacity: (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Location: (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
};

const ResourceCard = ({ resource, onBook }) => {
  const isAvailable = resource.status === "AVAILABLE";
  const style = isAvailable ? statusStyles.ACTIVE : statusStyles.OUT_OF_SERVICE;

  const statusText = isAvailable ? "Active" : "Out of Service";

  return (
    <div
      onClick={() => isAvailable && onBook?.(resource)}
      className={`group relative bg-white rounded-[32px] p-2 border border-slate-100 shadow-sm transition-all duration-300 
        ${
          isAvailable
            ? "hover:border-[#4FD1C5]/50 hover:shadow-xl hover:shadow-teal-50 cursor-pointer"
            : "opacity-80 cursor-not-allowed"
        }`}
    >
      {/* Inner Container */}
      <div className="bg-slate-50/50 rounded-[26px] p-5 transition-colors group-hover:bg-white">
        
        {/* Top Section: Icon & Status */}
        <div className="flex justify-between items-start mb-6">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm
            ${isAvailable ? "bg-[#E6FFFA] text-[#4FD1C5]" : "bg-slate-200 text-slate-400"}`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>

          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-colors ${style.badge}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "animate-pulse" : ""} ${style.dot}`}
            />
            {statusText}
          </span>
        </div>

        {/* Title Section */}
        <div className="mb-6">
          <h2 className="text-lg font-extrabold text-[#123A7A] group-hover:text-[#2F80ED] transition-colors line-clamp-1">
            {resource.name}
          </h2>
          <p className="text-xs font-bold text-[#4FD1C5] uppercase tracking-wide mt-1">
            {resource.type}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white border border-slate-100 group-hover:border-teal-50 transition-colors">
            <span className="text-[#4FD1C5]">{icons.Capacity}</span>
            <span className="text-xs font-bold text-slate-600">
              {resource.capacity} Seats
            </span>
          </div>
          <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white border border-slate-100 group-hover:border-teal-50 transition-colors">
            <span className="text-[#4FD1C5]">{icons.Location}</span>
            <span className="text-xs font-bold text-slate-600 truncate">
              {resource.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;