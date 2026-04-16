const statusBadge = {
  ACTIVE:         { bg: "bg-[#EAF3DE]", text: "text-[#3B6D11]", label: "Active" },
  OUT_OF_SERVICE: { bg: "bg-[#FAECE7]", text: "text-[#993C1D]", label: "Out of service" },
};

const ResourceTable = ({ resources, onEdit, onDelete }) => (
  <div className="bg-white mt-5 rounded-xl overflow-hidden" style={{ border: "0.5px solid #F5C4A0" }}>
    <div className="flex items-center justify-between px-4 py-3"
      style={{ borderBottom: "0.5px solid #FDE8D8" }}>
      <h2 className="text-sm font-medium" style={{ color: "#5C2E05" }}>All resources</h2>
      <span className="text-xs font-medium px-2 py-0.5 rounded-full"
        style={{ background: "#FFF0E8", color: "#C04A22" }}>
        {resources.length} resource{resources.length !== 1 ? "s" : ""}
      </span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
        <thead>
          <tr style={{ background: "#FFF8F3", borderBottom: "0.5px solid #FDE8D8" }}>
            {["Name","Type","Cap.","Location","Status","Actions"].map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-medium"
                style={{ color: "#C2855A" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-sm" style={{ color: "#C2855A" }}>
                No resources found.
              </td>
            </tr>
          ) : resources?.map((r) => {
            const b = statusBadge[r.status] || statusBadge.ACTIVE;
            return (
              <tr key={r.id} className="hover:bg-[#FFFAF7]"
                style={{ borderBottom: "0.5px solid #FDE8D8" }}>
                <td className="px-4 py-3 font-medium text-xs" style={{ color: "#5C2E05" }}>{r.name}</td>
                <td className="px-4 py-3 text-xs" style={{ color: "#5C2E05" }}>{r.type}</td>
                <td className="px-4 py-3 text-xs" style={{ color: "#5C2E05" }}>{r.capacity}</td>
                <td className="px-4 py-3 text-xs" style={{ color: "#5C2E05" }}>{r.location}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${b.bg} ${b.text}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {b.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => onEdit(r)}
                      className="h-7 px-3 text-xs font-medium rounded-md cursor-pointer"
                      style={{ background: "#FFF0E8", color: "#D85A30", border: "0.5px solid #F5C4A0" }}>
                      Edit
                    </button>
                    <button onClick={() => onDelete(r.id)}
                      className="h-7 px-3 text-xs font-medium rounded-md cursor-pointer"
                      style={{ background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F7C1C1" }}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default ResourceTable;