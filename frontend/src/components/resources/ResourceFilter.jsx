import { useState } from "react";

const ResourceFilter = ({ setFilters }) => {
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");

  const applyFilters = () => {
    setFilters({ type, capacity, location });
  };

  return (
    <div className="flex gap-3">
      <input placeholder="Type" onChange={(e) => setType(e.target.value)} />
      <input placeholder="Capacity" onChange={(e) => setCapacity(e.target.value)} />
      <input placeholder="Location" onChange={(e) => setLocation(e.target.value)} />

      <button onClick={applyFilters}>Search</button>
    </div>
  );
};

export default ResourceFilter;