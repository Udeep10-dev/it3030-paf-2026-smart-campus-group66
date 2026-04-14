const statusStyles = {
  available:   { bg: "#EAF3DE", color: "#3B6D11" },
  booked:      { bg: "#FAECE7", color: "#993C1D" },
  maintenance: { bg: "#FAEEDA", color: "#854F0B" },
};

const ResourceCard = ({ resource }) => {
  const badge = statusStyles[resource.status] || statusStyles.available;

  return (
    <div
      className="rounded-xl p-5 transition-colors"
      style={{ background: "#fff", border: "0.5px solid #F5C4A0" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#D85A30")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#F5C4A0")}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium" style={{ color: "#5C2E05" }}>
          {resource.name}
        </h2>
        <span
          className="text-xs font-medium px-2 py-1 rounded-full"
          style={{ background: badge.bg, color: badge.color }}
        >
          {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
        </span>
      </div>

      {[
        ["Type",     resource.type],
        ["Capacity", `${resource.capacity} people`],
        ["Location", resource.location],
      ].map(([label, value]) => (
        <div
          key={label}
          className="flex gap-2 text-xs py-1"
          style={{ borderBottom: "0.5px solid #FDE8D8", color: "#8B4513" }}
        >
          <span className="min-w-[64px]" style={{ color: "#C2855A" }}>{label}</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};
export default ResourceCard;