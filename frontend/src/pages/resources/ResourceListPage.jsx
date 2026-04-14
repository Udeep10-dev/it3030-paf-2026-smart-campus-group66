import { useEffect, useState } from "react";
import { getResources } from "../../api/resources/resourceApi.js";
import ResourceCard from "../../components/resources/ResourceCard";
import ResourceFilter from "../../components/resources/ResourceFilter";
import { Link } from "react-router-dom";

const ResourceListPage = () => {
  const [resources, setResources] = useState([
    {
      id: "1",
      title: "React Basics Guide",
      description:
        "Learn fundamentals of React including hooks and components.",
      category: "Programming",
      type: "PDF",
      status: "available",
    },
    {
      id: "2",
      title: "Database Design Notes",
      description: "Introduction to ER diagrams and normalization.",
      category: "Database",
      type: "Document",
      status: "available",
    },
    {
      id: "3",
      title: "Java Tutorial",
      description: "Complete beginner guide for Java programming.",
      category: "Programming",
      type: "Video",
      status: "out of stock",
    },
  ]);

  const [filters, setFilters] = useState({});

  const fetchResources = async () => {
    const res = await getResources(filters);
    setResources(res.data);
  };

  const filteredResources = resources.filter((r) => {
    if (!filters.category) return true;
    return r.category === filters.category;
  });

  return (
    <div className="min-h-screen p-6" style={{ background: "#FFF8F3" }}>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-medium" style={{ color: "#7C3B0A" }}>
          Resources
        </h1>

        <Link to="/resources/new">
          <button
            className="text-white px-4 py-2 rounded"
            style={{ background: "#D85A30" }}
          >
            + Add
          </button>
        </Link>
      </div>
      <ResourceFilter setFilters={setFilters} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredResources.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>
    </div>
  );
};
export default ResourceListPage;
