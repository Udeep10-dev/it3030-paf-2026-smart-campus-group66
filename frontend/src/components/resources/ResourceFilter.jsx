import React from 'react';

const ResourceFilter = ({ setFilters, themeColor }) => {
  // සටහන: මෙහි ඇති Tailwind classes ඔබේ පවතින ResourceFilter එකට ආදේශ කරන්න
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Input Field: Type */}
      <input
        type="text"
        placeholder="Type (e.g. Room)"
        className="flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none transition-all focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10"
        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
      />

      {/* Input Field: Capacity */}
      <input
        type="number"
        placeholder="Capacity"
        className="w-32 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none transition-all focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10"
        onChange={(e) => setFilters(prev => ({ ...prev, capacity: e.target.value }))}
      />

      {/* Input Field: Location */}
      <input
        type="text"
        placeholder="Location"
        className="flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none transition-all focus:border-[#4FD1C5] focus:ring-4 focus:ring-[#4FD1C5]/10"
        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
      />

      {/* Search Button - Hero Style Gradient */}
      <button
        className="rounded-xl bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-teal-100 transition-all hover:scale-105 hover:shadow-teal-200 active:scale-95"
      >
        Search
      </button>
    </div>
  );
};

export default ResourceFilter;