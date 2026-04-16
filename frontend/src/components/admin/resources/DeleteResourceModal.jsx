const DeleteResourceModal = ({ resource, onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
    onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
  >
    <div
      className="bg-white rounded-2xl w-full max-w-[420px] mx-4 p-6"
      style={{ border: "0.5px solid #F5C4A0" }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between mb-5 pb-4"
        style={{ borderBottom: "0.5px solid #FDE8D8" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: "#FAECE7" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2h4a1 1 0 0 1 1 1v1H5V3a1 1 0 0 1 1-1zM3 4h10l-.8 9.2A1 1 0 0 1 11.2 14H4.8a1 1 0 0 1-1-.8L3 4z" stroke="#993C1D" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M5 4V3M11 4V3" stroke="#993C1D" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M6.5 7v4M9.5 7v4" stroke="#993C1D" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-medium" style={{ color: "#5C2E05" }}>
              Delete resource
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#C2855A" }}>
              This action cannot be undone.
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-lg leading-none cursor-pointer ml-4 mt-0.5"
          style={{ color: "#C2855A", background: "none", border: "none" }}
        >
          ✕
        </button>
      </div>

      {/* Resource preview */}
      <div
        className="rounded-xl px-4 py-3 mb-5"
        style={{ background: "#FFF8F3", border: "0.5px solid #F5C4A0" }}
      >
        <p className="text-sm font-medium" style={{ color: "#8B4513" }}>
          {resource?.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#C2855A" }}>
          {[resource?.type, resource?.location].filter(Boolean).join(" · ")}
        </p>
      </div>

      <p className="text-sm mb-5 leading-relaxed" style={{ color: "#8B4513" }}>
        Are you sure you want to delete this resource? All associated data will
        be permanently removed.
      </p>

      {/* Actions */}
      <div
        className="flex gap-2 pt-4"
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
          onClick={() => onConfirm?.(resource?.id)}
          className="flex-1 h-10 rounded-lg text-sm font-medium text-white cursor-pointer"
          style={{ background: "#993C1D" }}
        >
          Delete resource
        </button>
      </div>
    </div>
  </div>
);

export default DeleteResourceModal;