import { useState } from "react";

const statusBadge = {
  AVAILABLE: {
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-400",
    label: "Active",
  },
  BOOKED: {
    badge: "bg-red-50 text-red-700 ring-1 ring-red-200",
    dot: "bg-red-400",
    label: "Out of service",
  },
};

const inputCls =
  "w-full h-10 px-3 rounded-xl text-sm text-orange-900 bg-orange-50 border border-orange-200 " +
  "placeholder:text-orange-300 focus:outline-none focus:border-orange-400 " +
  "focus:ring-2 focus:ring-orange-200 transition-all";

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

    if (!form.name.trim()) {
      newErrors.name = "Resource name is required";
    }

    if (!form.type.trim()) {
      newErrors.type = "Type is required";
    }

    if (!form.capacity) {
      newErrors.capacity = "Capacity is required";
    } else if (form.capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than 0";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!form.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const badge = statusBadge[form.status] || statusBadge.AVAILABLE;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-white rounded-3xl w-full max-w-lg mx-4 p-6 shadow-xl shadow-orange-100 border border-orange-100">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-5 border-b border-orange-50">
          <div>
            <h2 className="text-base font-bold text-orange-900 tracking-tight">
              {isEditing ? "Edit resource" : "Add new resource"}
            </h2>
            <p className="text-xs mt-1 text-orange-400">
              {isEditing
                ? "Update the resource details below."
                : "Fill in the details below to register a new resource."}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full flex items-center justify-center text-orange-300 hover:text-orange-500 hover:bg-orange-50 transition-all cursor-pointer text-base ml-4"
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-orange-700">
              Resource name
            </label>
            <input
              name="name"
              placeholder="e.g. Main Conference Room"
              value={form.name}
              onChange={handleChange}
              className={inputCls + (errors.name ? " border-red-400" : "")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-orange-700">
                Type
              </label>
              <input
                name="type"
                placeholder="e.g. Meeting Room"
                value={form.type}
                onChange={handleChange}
                className={inputCls + (errors.type ? " border-red-400" : "")}
              />
              {errors.type && (
                <p className="text-xs text-red-500 mt-1">{errors.type}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-orange-700">
                Capacity
              </label>
              <input
                name="capacity"
                type="number"
                placeholder="e.g. 20"
                value={form.capacity}
                onChange={handleChange}
                className={
                  inputCls + (errors.capacity ? " border-red-400" : "")
                }
              />
              {errors.capacity && (
                <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-orange-700">
                Location
              </label>
              <input
                name="location"
                placeholder="e.g. Floor 3, Block B"
                value={form.location}
                onChange={handleChange}
                className={
                  inputCls + (errors.location ? " border-red-400" : "")
                }
              />
              {errors.location && (
                <p className="text-xs text-red-500 mt-1">{errors.location}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-orange-700">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={
                  inputCls +
                  (errors.category ? " border-red-400" : "") +
                  " cursor-pointer appearance-none"
                }
              >
                <option value="">Select category</option>
                <option value="Lecture halls"> Lecture halls</option>
                <option value="Labs">Labs</option>
                <option value="Meeting rooms">Meeting rooms</option>
                <option value="Equipment">Equipment</option>
                <option value="Other">Other</option>
              </select>

              {errors.category && (
                <p className="text-xs text-red-500 mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 text-orange-700">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputCls + " cursor-pointer appearance-none"}
            >
              <option value="AVAILABLE">Active</option>
              <option value="BOOKED">Out of service</option>
            </select>
            <span
              className={`inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-2.5 py-1 rounded-full ${badge.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
              {badge.label}
            </span>
          </div>

          {/*
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-orange-700">
                Start Time
              </label>
              <input
                type="time"
                name="availabilityStart"
                value={form.availabilityStart}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-orange-700">
                End Time
              </label>
              <input
                type="time"
                name="availabilityEnd"
                value={form.availabilityEnd}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>
          */}
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-2 mt-6 pt-5 border-t border-orange-50">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 w-full px-5 rounded-xl text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (validate()) {
                onSubmit?.(form);
              }
            }}
            className="w-full h-10 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all cursor-pointer shadow-sm shadow-orange-200"
          >
            {isEditing ? "Update resource" : "Save resource"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;
