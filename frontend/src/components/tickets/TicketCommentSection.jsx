import { useState } from "react";

function TicketCommentSection({
  comments = [],
  newComment,
  setNewComment,
  onAddComment,
  submitting,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="mb-4 text-xl font-bold text-[#123A7A]">Comments</h3>

      <div className="mb-5">
        <textarea
          rows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2F80ED]"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onAddComment}
            disabled={submitting}
            className="rounded-full bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] px-5 py-2 font-semibold text-white shadow-md transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Posting..." : "Add Comment"}
          </button>
        </div>
      </div>

      {!comments.length ? (
        <p className="text-sm text-slate-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl border border-slate-200 bg-[#F5F8FC] p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#123A7A]">
                  User #{comment.userId}
                </p>
                <p className="text-xs text-slate-500">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              {editingId === comment.id ? (
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-full bg-[#123A7A] px-4 py-2 text-sm font-semibold text-white"
                      onClick={() => setEditingId(null)}
                    >
                      Save Later
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
                      onClick={() => {
                        setEditingId(null);
                        setEditingText("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm leading-6 text-slate-700">
                    {comment.commentText}
                  </p>
                  {comment.edited ? (
                    <p className="mt-2 text-xs text-slate-400">Edited</p>
                  ) : null}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketCommentSection;