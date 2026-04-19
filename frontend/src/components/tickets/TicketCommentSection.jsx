import { useState } from "react";

function TicketCommentSection({
  comments = [],
  newComment,
  setNewComment,
  onAddComment,
  submitting,
  onUpdateComment,
  onDeleteComment,
  actionCommentId,
  currentUserId = 1,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const startEditing = (comment) => {
    setEditingId(comment.id);
    setEditingText(comment.commentText);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingText.trim()) return;

    const updated = await onUpdateComment(editingId, editingText.trim());

    if (updated) {
      setEditingId(null);
      setEditingText("");
    }
  };

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
                <div className="flex items-center gap-3">
                  <p className="text-xs text-slate-500">
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                  {comment.userId === currentUserId && editingId !== comment.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(comment)}
                        className="text-xs font-semibold text-[#2F80ED]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteComment(comment.id)}
                        disabled={actionCommentId === comment.id}
                        className="text-xs font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionCommentId === comment.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  ) : null}
                </div>
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
                      className="rounded-full bg-[#123A7A] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={handleSaveEdit}
                      disabled={actionCommentId === comment.id}
                    >
                      {actionCommentId === comment.id ? "Saving..." : "Save"}
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
