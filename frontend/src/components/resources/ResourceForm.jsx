import { useState } from "react";

const statusBadge = {
  AVAILABLE: {
    badge: "bg-[#E6FFFA] text-[#0F766E] ring-1 ring-[#B2F5EA]",
    dot: "bg-[#4FD1C5]",
    label: "Active",
  },
  BOOKED: {
    badge: "bg-slate-50 text-slate-500 ring-1 ring-slate-200",
    dot: "bg-slate-300",
    label: "Out of service",
  },
};

// Input fields සඳහා Teal/Blue theme එකට ගැලපෙන classes
const inputCls =
  "w-full h-11 px-4 rounded-xl text-sm text-slate-700 bg-white border border-slate-200 " +
  "placeholder:text-slate-300 focus:outline-none focus:border-[#4FD1C5] " +
  "focus:ring-4 focus:ring-[#4FD1C5]/10 transition-all duration-300";

const ResourceForm = ({
  onSubmit,
  onCancel,
  initialData = {},
  isEditing = false,
}) => {
  const [form, setForm] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
    category: "",
    status: "AVAILABLE",
    availabilityStart: "",
    availabilityEnd: "",
    ...initialData,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Resource name is required";
    if (!form.type.trim()) newErrors.type = "Type is required";
    if (!form.capacity) {
      newErrors.capacity = "Capacity is required";
    } else if (form.capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than 0";
    }
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.category) newErrors.category = "Please select a category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const badge = statusBadge[form.status] || statusBadge.AVAILABLE;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-slate-900/20"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-white rounded-[32px] w-full max-w-lg mx-4 p-8 shadow-2xl shadow-slate-200 border border-slate-100">
        
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8 pb-5 border-b border-slate-50">
          <div>
            <h2 className="text-xl font-black text-[#123A7A] tracking-tight">
              {isEditing ? "Edit Resource" : "Add New Resource"}
            </h2>
            <p className="text-xs mt-1 text-slate-400 font-medium">
              {isEditing
                ? "Update the resource details below."
                : "Fill in the details below to register a new resource."}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Fields Container */}
        <div className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-2 text-[#123A7A]">
              Resource Name
            </label>
            <input
              name="name"
              placeholder="e.g. Main Conference Room"
              value={form.name}
              onChange={handleChange}
              className={`${inputCls} ${errors.name ? "border-red-400 focus:ring-red-50" : ""}`}
            />
            {errors.name && (
              <p className="text-[10px] text-red-500 mt-1.5 font-bold uppercase tracking-tighter italic">! {errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2 text-[#123A7A]">
                Type
              </label>
              <input
                name="type"
                placeholder="e.g. Meeting Room"
                value={form.type}
                onChange={handleChange}
                className={`${inputCls} ${errors.type ? "border-red-400 focus:ring-red-50" : ""}`}
              />
              {errors.type && (
                <p className="text-[10px] text-red-500 mt-1.5 font-bold italic">! {errors.type}</p>
              )}
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2 text-[#123A7A]">
                Capacity
              </label>
              <input
                name="capacity"
                type="number"
                placeholder="e.g. 20"
                value={form.capacity}
                onChange={handleChange}
                className={`${inputCls} ${errors.capacity ? "border-red-400 focus:ring-red-50" : ""}`}
              />
              {errors.capacity && (
                <p className="text-[10px] text-red-500 mt-1.5 font-bold italic">! {errors.capacity}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2 text-[#123A7A]">
                Location
              </label>
              <input
                name="location"
                placeholder="e.g. Floor 3, Block B"
                value={form.location}
                onChange={handleChange}
                className={`${inputCls} ${errors.location ? "border-red-400 focus:ring-red-50" : ""}`}
              />
              {errors.location && (
                <p className="text-[10px] text-red-500 mt-1.5 font-bold italic">! {errors.location}</p>
              )}
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2 text-[#123A7A]">
                Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`${inputCls} ${errors.category ? "border-red-400" : ""} cursor-pointer appearance-none`}
                >
                  <option value="">Select category</option>
                  <option value="Lecture halls">Lecture halls</option>
                  <option value="Labs">Labs</option>
                  <option value="Meeting rooms">Meeting rooms</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-2 text-[#123A7A]">
              Operational Status
            </label>
            <div className="flex items-center gap-4">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={`${inputCls} w-2/3 cursor-pointer appearance-none`}
              >
                <option value="AVAILABLE">Set as Active</option>
                <option value="BOOKED">Set as Out of Service</option>
              </select>
              <span
                className={`flex-1 inline-flex items-center justify-center gap-2 text-[10px] font-black px-4 h-11 rounded-xl uppercase tracking-wider transition-all ${badge.badge}`}
              >
                <span className={`w-2 h-2 rounded-full ${badge.dot} ${form.status === 'AVAILABLE' ? 'animate-pulse' : ''}`} />
                {badge.label}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between gap-4 mt-10 pt-6 border-t border-slate-50">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 w-full px-5 rounded-xl text-sm font-bold text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={() => {
              if (validate()) {
                onSubmit?.(form);
              }
            }}
            className="w-full h-12 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-teal-100"
          >
            {isEditing ? "Update Resource" : "Register Resource"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;