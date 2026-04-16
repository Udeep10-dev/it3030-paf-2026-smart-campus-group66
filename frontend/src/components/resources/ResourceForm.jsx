import { useState } from "react";

const statusBadge = {
  ACTIVE: { bg: "bg-[#EAF3DE]", text: "text-[#3B6D11]", label: "Active" },
  OUT_OF_SERVICE: {
    bg: "bg-[#FAECE7]",
    text: "text-[#993C1D]",
    label: "Out of service",
  },
};

const inputCls =
  "w-full h-[38px] px-3 rounded-lg text-sm text-[#5C2E05] bg-[#FFF8F3] " +
  "border border-[#F5C4A0] placeholder:text-[#C2855A] " +
  "focus:outline-none focus:border-[#D85A30] focus:ring-2 focus:ring-[#FAECE7]";

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
    status: "ACTIVE",
    ...initialData,
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const badge = statusBadge[form.status] || statusBadge.ACTIVE;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6"
        style={{ border: "0.5px solid #F5C4A0" }}
      >
        <div
          className="flex items-start justify-between mb-5 pb-4"
          style={{ borderBottom: "0.5px solid #FDE8D8" }}
        >
          <div>
            <h2 className="text-base font-medium" style={{ color: "#5C2E05" }}>
              {isEditing ? "Edit resource" : "Add new resource"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#C2855A" }}>
              {isEditing
                ? "Update the resource details below."
                : "Fill in the details below to register a new resource."}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-lg leading-none cursor-pointer ml-4 mt-0.5"
            style={{ color: "#C2855A", background: "none", border: "none" }}
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "#8B4513" }}
            >
              Resource name
            </label>
            <input
              name="name"
              placeholder="e.g. Main Conference Room"
              value={form.name}
              onChange={handleChange}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#8B4513" }}
              >
                Type
              </label>
              <input
                name="type"
                placeholder="e.g. Meeting Room"
                value={form.type}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "#8B4513" }}
              >
                Capacity
              </label>
              <input
                name="capacity"
                type="number"
                placeholder="e.g. 20"
                value={form.capacity}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "#8B4513" }}
            >
              Location
            </label>
            <input
              name="location"
              placeholder="e.g. Floor 3, Block B"
              value={form.location}
              onChange={handleChange}
              className={inputCls}
            />
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "#8B4513" }}
            >
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputCls + " cursor-pointer appearance-none"}
            >
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out of service</option>
            </select>
            <span
              className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {badge.label}
            </span>
          </div>
        </div>

        <div
          className="flex gap-2 mt-5 pt-4"
          style={{ borderTop: "0.5px solid #FDE8D8" }}
        >
          <button
            type="button"
            onClick={onCancel}
            className="h-10 px-5 rounded-lg text-sm cursor-pointer"
            style={{
              color: "#8B4513",
              border: "0.5px solid #F5C4A0",
              background: "transparent",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit?.(form)}
            className="flex-1 h-10 rounded-lg text-sm font-medium text-white cursor-pointer"
            style={{ background: "#D85A30" }}
          >
            {isEditing ? "Update resource" : "Save resource"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;
