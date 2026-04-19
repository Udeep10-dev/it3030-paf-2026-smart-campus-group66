import { useEffect, useState } from "react";
import ResourceCard from "../../components/resources/ResourceCard";
import ResourceFilter from "../../components/resources/ResourceFilter";
import resourceService from "../../services/resourceService";

const ResourceListPage = () => {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({});

  const fetchResources = async () => {
    let res;

    if (filters && Object.keys(filters).length > 0) {
      res = await resourceService.filter(filters);
    } else {
      res = await resourceService.getAll();
    }

    setResources(res.data);
  };
  useEffect(() => {
    fetchResources();
  }, [filters]);

  return (
    <div className="min-h-screen p-6" style={{ background: "#FFF8F3" }}>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-medium" style={{ color: "#7C3B0A" }}>
          Resources
        </h1>
      </div>
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
