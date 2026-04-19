import React, { useState } from "react";
import ResourceCard from "../../components/resources/ResourceCard";

const ResourceMap = () => {
  const [resources] = useState([
    {
      id: 1,
      name: "Main Lab 01",
      type: "Laboratory",
      capacity: 40,
      location: "Level 1, Block A",
      status: "AVAILABLE",
      mapX: 175,
      mapY: 135,
    },
    {
      id: 2,
      name: "Meeting Room 2",
      type: "Conference",
      capacity: 10,
      location: "Level 1, Block B",
      status: "OUT_OF_SERVICE",
      mapX: 150,
      mapY: 365,
    },
    {
      id: 3,
      name: "Lecture Hall 05",
      type: "Hall",
      capacity: 120,
      location: "Level 1, Block C",
      status: "AVAILABLE",
      mapX: 525,
      mapY: 135,
    },
    {
      id: 4,
      name: "Study Zone",
      type: "Public",
      capacity: 50,
      location: "Level 1, Block D",
      status: "AVAILABLE",
      mapX: 500,
      mapY: 365,
    },
    {
      id: 5,
      name: "New Lab 02",
      type: "Public",
      capacity: 50,
      location: "Level 1, Block D",
      status: "AVAILABLE",
      mapX: 500,
      mapY: 365,
    },
  ]);

  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-stone-50 min-h-screen font-sans">
      {/* 1. Left Side: Resource List */}
      <div className="w-full lg:w-1/3 space-y-4 overflow-y-auto max-h-[90vh] pr-2 custom-scrollbar">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-stone-800 tracking-tight">
            Campus Resources
          </h1>
          <p className="text-stone-500 text-sm">
            Real-time facility availability map
          </p>
        </div>

        {resources.map((res) => (
          <div
            key={res.id}
            onMouseEnter={() => setSelectedId(res.id)}
            onMouseLeave={() => setSelectedId(null)}
            className={`transition-all duration-300 transform ${selectedId === res.id ? "translate-x-2" : ""}`}
          >
            <ResourceCard
              resource={res}
              onBook={(r) => console.log("Booking:", r.name)}
            />
          </div>
        ))}
      </div>

      {/* 2. Right Side: Advanced Interactive Map */}
      <div className="w-full lg:w-2/3 sticky top-6">
        <div className="bg-white rounded-[40px] p-8 border border-stone-200 shadow-xl shadow-stone-200/50 h-[650px] flex flex-col">
          {/* Map Header */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h3 className="font-bold text-stone-800 text-lg">
                Interactive Floor Plan
              </h3>
              <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mt-1">
                Ground Floor • Block A-D
              </p>
            </div>
            <div className="flex gap-4 bg-stone-50 p-2 rounded-2xl border border-stone-100">
              <div className="flex items-center gap-2 text-[10px] font-bold text-stone-500 px-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />{" "}
                AVAILABLE
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-stone-500 px-2 border-l border-stone-200">
                <span className="w-2 h-2 rounded-full bg-stone-300" /> IN USE
              </div>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative flex-1 bg-[#fcfcfb] rounded-[32px] overflow-hidden border border-stone-100 shadow-inner">
            <svg viewBox="0 0 800 500" className="w-full h-full">
              {/* --- Floor Base --- */}
              <rect width="800" height="500" fill="#fcfcfb" />

              {/* --- Hallways (The path students walk) --- */}
              <path d="M50 220 L750 220 L750 280 L50 280 Z" fill="#f5f5f4" />
              <path d="M370 50 L430 50 L430 450 L370 450 Z" fill="#f5f5f4" />

              {/* --- Room Separations --- */}
              {/* Block A - Top Left */}
              <rect
                x="50"
                y="50"
                width="320"
                height="170"
                fill="white"
                stroke="#e7e5e4"
                strokeWidth="2"
                rx="12"
              />
              <text
                x="70"
                y="80"
                className="fill-stone-300 text-[10px] font-bold uppercase tracking-widest"
              >
                Block A
              </text>

              {/* Block B - Bottom Left */}
              <rect
                x="50"
                y="280"
                width="320"
                height="170"
                fill="white"
                stroke="#e7e5e4"
                strokeWidth="2"
                rx="12"
              />
              <text
                x="70"
                y="310"
                className="fill-stone-300 text-[10px] font-bold uppercase tracking-widest"
              >
                Block B
              </text>

              {/* Block C - Top Right */}
              <rect
                x="430"
                y="50"
                width="320"
                height="170"
                fill="white"
                stroke="#e7e5e4"
                strokeWidth="2"
                rx="12"
              />
              <text
                x="450"
                y="80"
                className="fill-stone-300 text-[10px] font-bold uppercase tracking-widest"
              >
                Block C
              </text>

              {/* Block D - Bottom Right */}
              <rect
                x="430"
                y="280"
                width="320"
                height="170"
                fill="white"
                stroke="#e7e5e4"
                strokeWidth="2"
                rx="12"
              />
              <text
                x="450"
                y="310"
                className="fill-stone-300 text-[10px] font-bold uppercase tracking-widest"
              >
                Block D
              </text>

              {/* Doors (Visual Gaps) */}
              <rect x="150" y="217" width="40" height="6" fill="#f5f5f4" />
              <rect x="500" y="217" width="40" height="6" fill="#f5f5f4" />
              <rect x="150" y="277" width="40" height="6" fill="#f5f5f4" />
              <rect x="500" y="277" width="40" height="6" fill="#f5f5f4" />

              {/* --- Interactive Resource Pins --- */}
              {resources.map((res) => {
                const isSelected = selectedId === res.id;
                const isAvailable = res.status === "AVAILABLE";

                return (
                  <g
                    key={res.id}
                    onMouseEnter={() => setSelectedId(res.id)}
                    onMouseLeave={() => setSelectedId(null)}
                    onClick={() => console.log("Clicked:", res.name)}
                    className="cursor-pointer group"
                  >
                    {/* Ripple / Highlight */}
                    {isSelected && (
                      <circle
                        cx={res.mapX}
                        cy={res.mapY}
                        r="25"
                        className="fill-amber-400 opacity-20 animate-ping"
                      />
                    )}

                    {/* Pin Backdrop (For Selected State) */}
                    <rect
                      x={res.mapX - 50}
                      y={res.mapY - 50}
                      width="100"
                      height="28"
                      rx="14"
                      className={`transition-all duration-300 fill-stone-800 shadow-xl ${isSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                    />
                    <text
                      x={res.mapX}
                      y={res.mapY - 32}
                      textAnchor="middle"
                      className={`text-[10px] font-bold fill-white transition-all duration-300 ${isSelected ? "opacity-100" : "opacity-0"}`}
                    >
                      {res.name}
                    </text>

                    {/* Main Circle Marker */}
                    <circle
                      cx={res.mapX}
                      cy={res.mapY}
                      r={isSelected ? "11" : "8"}
                      className={`transition-all duration-300 stroke-white stroke-[3px] shadow-lg
                        ${isAvailable ? "fill-amber-500" : "fill-stone-400"}
                        ${isSelected ? "shadow-amber-200/50" : ""}`}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceMap;
