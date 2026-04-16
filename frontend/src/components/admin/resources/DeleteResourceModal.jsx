const DeleteResourceModal = ({ resource, onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
    onClick={(e) => {
      if (e.target === e.currentTarget) onCancel();
    }}
  >
    <div className="bg-white rounded-3xl w-full max-w-[420px] mx-4 p-6 shadow-xl shadow-red-100 border border-red-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 pb-5 border-b border-red-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-red-100">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 2h4a1 1 0 0 1 1 1v1H5V3a1 1 0 0 1 1-1zM3 4h10l-.8 9.2A1 1 0 0 1 11.2 14H4.8a1 1 0 0 1-1-.8L3 4z"
                stroke="#dc2626"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M5 4V3M11 4V3"
                stroke="#dc2626"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M6.5 7v4M9.5 7v4"
                stroke="#dc2626"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-red-900">Delete resource</h2>
            <p className="text-xs mt-0.5 text-red-400">
              This action cannot be undone.
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-red-300 hover:text-red-500 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer text-lg"
        >
          ✕
        </button>
      </div>

      {/* Resource preview card */}
      <div className="rounded-2xl px-4 py-3 mb-5 bg-orange-50 border border-orange-100">
        <p className="text-sm font-bold text-orange-900">{resource?.name}</p>
        <p className="text-xs mt-0.5 text-orange-400">
          {[resource?.type, resource?.location].filter(Boolean).join(" · ")}
        </p>
      </div>

      <p className="text-sm text-orange-800 mb-6 leading-relaxed">
        Are you sure you want to delete this resource? All associated data will
        be permanently removed.
      </p>

      <div className="flex gap-2 pt-5 border-t border-red-50">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 px-5 rounded-xl text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onConfirm?.(resource?.id)}
          className="flex-1 h-10 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all cursor-pointer shadow-sm shadow-red-200"
        >
          Delete resource
        </button>
      </div>
    </div>
  </div>
);

export default DeleteResourceModal;
