import { useEffect, useState } from "react";
// Mekai hariyatama path eka
import { getResources } from "../../api/resources/resourceApi.js";
import ResourceCard from "../../components/resources/ResourceCard";
import ResourceFilter from "../../components/resources/ResourceFilter";

const ResourceListPage = () => {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({});

  const fetchResources = async () => {
    const res = await getResources(filters);
    setResources(res.data);
  };

  useEffect(() => { fetchResources(); }, [filters]);

  return (
    <div className="min-h-screen p-6" style={{ background: "#FFF8F3" }}>
      <h1 className="text-2xl font-medium mb-5" style={{ color: "#7C3B0A" }}>
        Resources
      </h1>
      <ResourceFilter setFilters={setFilters} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {resources.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>
    </div>
  );
};
export default ResourceListPage;