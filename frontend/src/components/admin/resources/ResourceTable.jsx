import React from "react";

const statusConfig = {
  AVAILABLE: {
    dot: "bg-[#4FD1C5]",
    badge: "bg-[#E6FFFA] text-[#0F766E] ring-1 ring-[#B2F5EA]",
    label: "Active",
  },
  BOOKED: {
    dot: "bg-slate-400",
    badge: "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
    label: "Out of service",
  },
};

const ResourceTable = ({ resources, onEdit, onDelete }) => (
  <div className="bg-white mt-5 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
    
    {/* Table Header Section */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white">
      <h2 className="text-sm font-bold text-[#123A7A] tracking-tight uppercase">
        Resource Inventory
      </h2>
      <span className="text-[11px] font-black px-3 py-1 rounded-lg bg-[#E6FFFA] text-[#0F766E] border border-[#B2F5EA]">
        {resources.length} {resources.length === 1 ? "RESOURCE" : "RESOURCES"}
      </span>
    </div>

    <div className="overflow-x-auto">
      <table
        className="w-full text-sm"
        style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
      >
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            {["Name", "Type", "Category", "Cap.", "Location", "Status", "Actions"].map(
              (h) => (
                <th
                  key={h}
                  className="text-left px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {resources.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="text-center py-16 text-sm text-slate-400 font-medium bg-slate-50/20"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">📁</span>
                  No resources found in the database.
                </div>
              </td>
            </tr>
          ) : (
            resources.map((r) => {
              const b = statusConfig[r.status] || statusConfig.AVAILABLE;
              return (
                <tr
                  key={r.id}
                  className="hover:bg-[#F0FDFB]/50 transition-colors group"
                >
                  <td className="px-6 py-4 font-bold text-[#123A7A] text-xs">
                    {r.name}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium uppercase tracking-wider">
                    {r.type || "—"}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {r.category ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                        {r.category}
                      </span>
                    ) : (
                      <span className="text-slate-300 font-medium">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-bold">
                    {r.capacity ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                    {r.location || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide transition-all ${b.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${b.dot} ${r.status === 'AVAILABLE' ? 'animate-pulse' : ''}`} />
                      {b.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(r)}
                        className="h-8 px-4 text-[11px] font-bold rounded-lg cursor-pointer bg-white text-[#123A7A] border border-slate-200 hover:border-[#4FD1C5] hover:text-[#4FD1C5] active:scale-95 transition-all shadow-sm"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => onDelete(r)}
                        className="h-8 px-4 text-[11px] font-bold rounded-lg cursor-pointer bg-red-50 text-red-600 hover:bg-red-600 hover:text-white active:scale-95 transition-all border border-red-100 shadow-sm"
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default ResourceTable;