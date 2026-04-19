import React, { useState } from 'react';
import ResourceCard from '../../components/resources/ResourceCard';

const ResourceMap = () => {
  // Sample Data - ඔයාගේ Database එකෙන් එන විදිහට මේක පස්සේ මාරු කරන්න
  const [resources] = useState([
    { id: 1, name: "Main Lab 01", type: "Laboratory", capacity: 40, location: "Level 1, Block A", status: "AVAILABLE", mapX: 200, mapY: 150 },
    { id: 2, name: "Meeting Room 2", type: "Conference", capacity: 10, location: "Level 2, Block B", status: "OUT_OF_SERVICE", mapX: 450, mapY: 120 },
    { id: 3, name: "Lecture Hall 05", type: "Hall", capacity: 120, location: "Level 1, Block C", status: "AVAILABLE", mapX: 350, mapY: 350 },
  ]);

  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-stone-50 min-h-screen">
      
      {/* 1. Left Side: Resource List & Filters */}
      <div className="w-full lg:w-1/3 space-y-4 overflow-y-auto max-h-[90vh] pr-2">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-800">Campus Resources</h1>
          <p className="text-stone-500 text-sm">Find and book available facilities</p>
        </div>
        
        {resources.map(res => (
          <div 
            key={res.id}
            onMouseEnter={() => setSelectedId(res.id)}
            onMouseLeave={() => setSelectedId(null)}
            className={`transition-all duration-300 ${selectedId === res.id ? 'scale-[1.02]' : ''}`}
          >
            <ResourceCard 
              resource={res} 
              onBook={(r) => console.log("Booking:", r.name)} 
            />
          </div>
        ))}
      </div>

      {/* 2. Right Side: Interactive Floor Map */}
      <div className="w-full lg:w-2/3 sticky top-6">
        <div className="bg-white rounded-[32px] p-4 border border-stone-200 shadow-sm h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-4 px-4 pt-2">
            <h3 className="font-bold text-stone-700">Interactive Floor Plan</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" /> Available
               </div>
               <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-300" /> Occupied
               </div>
            </div>
          </div>

          <div className="relative flex-1 bg-stone-100 rounded-2xl overflow-hidden border border-stone-100 border-dashed">
            <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-sm">
              {/* Simple Campus Outlines */}
              <rect x="50" y="50" width="700" height="400" rx="24" fill="#ffffff" />
              <path d="M50 250 L750 250" stroke="#f5f5f4" strokeWidth="40" /> {/* Main Hallway */}

              {/* Dynamic Pins */}
              {resources.map((res) => (
                <g 
                  key={res.id}
                  onClick={() => setSelectedId(res.id)}
                  className="cursor-pointer group"
                >
                  {/* Ripple Effect for Selected/Active */}
                  {(selectedId === res.id || res.status === "AVAILABLE") && (
                    <circle cx={res.mapX} cy={res.mapY} r="15" className={`fill-amber-400 opacity-20 ${selectedId === res.id ? 'animate-ping' : ''}`} />
                  )}
                  
                  {/* Main Pin */}
                  <circle 
                    cx={res.mapX} 
                    cy={res.mapY} 
                    r={selectedId === res.id ? "10" : "7"} 
                    className={`transition-all duration-500 stroke-white stroke-2 shadow-xl
                      ${res.status === "AVAILABLE" ? 'fill-amber-500' : 'fill-stone-400'}
                      ${selectedId === res.id ? 'fill-amber-600 ring-8 ring-amber-100' : ''}`}
                  />

                  {/* Tooltip on Pin */}
                  {selectedId === res.id && (
                    <foreignObject x={res.mapX - 60} y={res.mapY - 60} width="120" height="50">
                      <div className="bg-stone-800 text-white text-[10px] py-1 px-2 rounded-lg shadow-xl text-center font-bold">
                        {res.name}
                      </div>
                    </foreignObject>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ResourceMap;