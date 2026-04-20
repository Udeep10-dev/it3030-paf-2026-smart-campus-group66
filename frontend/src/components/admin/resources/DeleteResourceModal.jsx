import React from "react";

const DeleteResourceModal = ({ resource, onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-slate-900/20"
    onClick={(e) => {
      if (e.target === e.currentTarget) onCancel();
    }}
  >
    <div className="bg-white rounded-[32px] w-full max-w-[420px] mx-4 p-8 shadow-2xl shadow-slate-200 border border-slate-100">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6 pb-5 border-b border-slate-50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0 ring-1 ring-red-100 shadow-sm">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-black text-[#123A7A] tracking-tight uppercase">
              Delete Resource
            </h2>
            <p className="text-[10px] mt-1 text-red-500 font-bold uppercase tracking-wider italic">
              Warning: This action is permanent.
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-slate-300 hover:text-slate-600 hover:bg-slate-50 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Resource Preview Card - Styled in our Theme Colors */}
      <div className="rounded-2xl px-5 py-4 mb-6 bg-[#E6FFFA]/50 border border-[#B2F5EA]">
        <p className="text-sm font-black text-[#123A7A] uppercase tracking-tight">
          {resource?.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-[#4FD1C5] uppercase">
            {resource?.type}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[10px] font-medium text-slate-400">
            {resource?.location}
          </span>
        </div>
      </div>

      <p className="text-xs font-medium text-slate-500 mb-8 leading-relaxed">
        Are you sure you want to delete this resource? All data associated with{" "}
        <b className="text-slate-700">{resource?.name}</b> will be permanently
        removed from the system.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t border-slate-50">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-12 rounded-xl text-xs font-bold text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
        >
          KEEP IT
        </button>
        <button
          type="button"
          onClick={() => onConfirm?.(resource?.id)}
          className="flex-[1.5] h-12 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all cursor-pointer shadow-lg shadow-red-100 uppercase tracking-widest"
        >
          CONFIRM DELETE
        </button>
      </div>
    </div>
  </div>
);

export default DeleteResourceModal;
