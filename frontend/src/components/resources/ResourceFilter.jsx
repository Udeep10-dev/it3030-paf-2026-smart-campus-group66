import { useState } from "react";

const ResourceFilter = ({ setFilters }) => {
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");

  const applyFilters = () => setFilters({ type, capacity, location });

  const inputStyle = {
    background: "#FFF8F3",
    border: "0.5px solid #F5C4A0",
    color: "#5C2E05",
    borderRadius: "8px",
    height: "36px",
    padding: "0 12px",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <div
      className="flex flex-wrap gap-3 items-center p-4 rounded-xl"
      style={{ background: "#fff", border: "0.5px solid #F5C4A0" }}
    >
      <input
        placeholder="Type (e.g. Room)"
        style={inputStyle}
        onChange={(e) => setType(e.target.value)}
        className="flex-1 min-w-[120px] focus:border-orange-500"
      />
      <input
        placeholder="Capacity"
        style={inputStyle}
        onChange={(e) => setCapacity(e.target.value)}
        className="flex-1 min-w-[100px]"
      />
      <input
        placeholder="Location"
        style={inputStyle}
        onChange={(e) => setLocation(e.target.value)}
        className="flex-1 min-w-[120px]"
      />
      <button
        onClick={applyFilters}
        className="h-9 px-5 rounded-lg text-sm font-medium text-white transition-colors"
        style={{ background: "#D85A30" }}
        onMouseEnter={(e) => (e.target.style.background = "#C04A22")}
        onMouseLeave={(e) => (e.target.style.background = "#D85A30")}
      >
        Search
      </button>
    </div>
  );
};

export default ResourceFilter;