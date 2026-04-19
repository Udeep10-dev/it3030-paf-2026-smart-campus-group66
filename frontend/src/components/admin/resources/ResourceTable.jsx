const statusConfig = {
  AVAILABLE: {
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    label: "Active",
  },
  BOOKED: {
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-700 ring-1 ring-red-200",
    label: "Out of service",
  },
};

const ResourceTable = ({ resources, onEdit, onDelete }) => (
  <div className="bg-white mt-5 rounded-2xl overflow-hidden border border-orange-100 shadow-sm">
    {/* Table Header */}
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-orange-50 bg-gradient-to-r from-orange-50/60 to-white">
      <h2 className="text-sm font-semibold text-orange-900 tracking-tight">
        All resources
      </h2>
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-600">
        {resources.length} resource{resources.length !== 1 ? "s" : ""}
      </span>
    </div>

    <div className="overflow-x-auto">
      <table
        className="w-full text-sm"
        style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
      >
        <thead>
          <tr className="bg-orange-50/40 border-b border-orange-100">
            {["Name", "Type", "Category", "Cap.", "Location", "Status", "Actions"].map(
              (h) => (
                <th
                  key={h}
                  className="text-left px-5 py-2.5 text-xs font-semibold text-orange-400 uppercase tracking-widest"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-orange-50">
          {resources.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="text-center py-12 text-sm text-orange-300 font-medium"
              >
                No resources found.
              </td>
            </tr>
          ) : (
            resources.map((r) => {
              const b = statusConfig[r.status] || statusConfig.AVAILABLE;
              return (
                <tr
                  key={r.id}
                  className="hover:bg-orange-50/40 transition-colors group"
                >
                  <td className="px-5 py-3.5 font-semibold text-orange-900 text-xs">
                    {r.name}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-orange-500 font-medium">
                    {r.type || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    {r.category ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-orange-50 text-orange-600 ring-1 ring-orange-200">
                        {r.category}
                      </span>
                    ) : (
                      <span className="text-orange-300 font-medium">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-orange-500 font-medium">
                    {r.capacity ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-orange-500 font-medium">
                    {r.location || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${b.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />
                      {b.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(r)}
                        className="h-7 px-3 text-xs font-semibold rounded-lg cursor-pointer bg-orange-100 text-orange-600 hover:bg-orange-200 active:scale-95 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(r)}
                        className="h-7 px-3 text-xs font-semibold rounded-lg cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 active:scale-95 transition-all ring-1 ring-red-100"
                      >
                        Delete
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