import { useEffect, useState } from "react";
import ResourceCard from "../../components/resources/ResourceCard";
import ResourceFilter from "../../components/resources/ResourceFilter";
import resourceService from "../../services/resourceService";
import { Link } from "react-router-dom";

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
    <div className="relative min-h-screen overflow-hidden bg-white font-sans">
      
      {/* Background Decorative Elements - Matching Hero Section */}
      <div className="absolute left-0 top-0 h-40 w-40 rounded-br-full bg-[#4FD1C5]/15 pointer-events-none"></div>
      <div className="absolute right-0 top-0 h-48 w-80 rounded-bl-[100px] bg-gradient-to-r from-[#4FD1C5]/10 to-[#2F80ED]/10 pointer-events-none"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Top Header Section */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="mb-3 inline-block rounded-full bg-[#DFF8F6] px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#0F766E]">
              Modern Campus Service Experience
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-[#123A7A] sm:text-5xl">
              Manage Resources
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Explore and book campus assets. From study rooms to lab equipment, 
              everything is now at your fingertips through our smart portal.
            </p>
          </div>

          {/* Secondary Button Style - Deep Blue Outline */}
          <Link
            to="/resources/map"
            className="flex items-center gap-2 rounded-full border-2 border-[#123A7A] px-8 py-3 text-sm font-bold text-[#123A7A] transition-all hover:bg-[#123A7A] hover:text-white hover:shadow-lg active:scale-95 sm:text-base"
          >
            📍 View on Map
          </Link>
        </div>

        {/* Filter Section Container - Custom Styled for your Image */}
        {/* Note: Ensure ResourceFilter component uses the theme colors internally as well */}
        <div className="mb-12 rounded-[28px] border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-200/60 ring-1 ring-slate-200/50">
          <div className="rounded-[22px] bg-slate-50/50 p-4 sm:p-6">
             <ResourceFilter setFilters={setFilters} themeColor="#4FD1C5" />
          </div>
        </div>

        {/* Resources Grid Header Controls */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-[#123A7A]">Available Resources</h3>
            <span className="rounded-full bg-[#DFF8F6] px-3 py-1 text-xs font-bold text-[#0F766E]">
              {resources.length} found
            </span>
          </div>
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {resources.length > 0 ? (
            resources.map((r) => (
              <div 
                key={r.id} 
                className="group transition-all duration-300 hover:-translate-y-2"
              >
                <ResourceCard resource={r} />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-[32px] bg-[#F8FAFC] py-24 border-2 border-dashed border-slate-200">
              <div className="mb-4 text-5xl opacity-50">🔍</div>
              <h4 className="text-xl font-bold text-[#123A7A]">No resources found</h4>
              <p className="mt-2 text-slate-500">Adjust your filters to see more results.</p>
              <button 
                onClick={() => setFilters({})}
                className="mt-6 font-bold text-[#2F80ED] hover:text-[#123A7A] transition-colors underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceListPage;