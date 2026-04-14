import { useEffect, useState } from "react";
import { getResources } from "../../api/resources/resourceApi.js";
import ResourceFilter from "../../components/resources/ResourceFilter";
import ResourceForm from "../../components/resources/ResourceForm.jsx";

const ResourceFormPage = () => {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({});

  const fetchResources = async () => {
    const res = await getResources(filters);
    setResources(res.data);
  };

  useEffect(() => {
    fetchResources();
  }, [filters]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Resources</h1>

      <ResourceFilter setFilters={setFilters} />

      <div className="grid grid-cols-3 gap-4 mt-4">
        <ResourceForm />
      </div>
    </div>
  );
};

export default ResourceFormPage;