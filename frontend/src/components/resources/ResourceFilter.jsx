import { useState } from "react";
import resourceService from "../../services/resourceService";

const ResourceFilter = ({ setFilters }) => {
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");

  const applyFilters = async () => {
    const res = await resourceService.filter({
      type,
      capacity,
      location,
    });

    setFilters(res.data);
  };

  const inputCls =
    "flex-1 min-w-[120px] h-9 px-3 rounded-lg text-sm bg-orange-50 border border-orange-200 " +
    "text-orange-900 placeholder:text-orange-300 focus:outline-none focus:ring-2 " +
    "focus:ring-orange-300 focus:border-orange-400 transition-all";

  return (
    <div className="flex flex-wrap gap-3 items-center p-4 bg-white rounded-2xl border border-orange-100 shadow-sm">
      <input
        placeholder="Type (e.g. Room)"
        className={inputCls}
        onChange={(e) => setType(e.target.value)}
      />
      <input
        placeholder="Capacity"
        className={inputCls}
        onChange={(e) => setCapacity(e.target.value)}
      />
      <input
        placeholder="Location"
        className={inputCls}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button
        onClick={applyFilters}
        className="h-9 px-5 rounded-lg text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all cursor-pointer shadow-sm shadow-orange-200"
      >
        Search
      </button>
    </div>
  );
};

export default ResourceFilter;
