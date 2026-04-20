import { resolveBackendAssetUrl } from "../../utils/resolveBackendAssetUrl";

function TicketAttachmentGallery({
  attachments = [],
  currentUserId = 1,
  onDeleteAttachment,
  deletingAttachmentId,
}) {
  if (!attachments.length) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="mb-3 text-xl font-bold text-[#123A7A]">Attachments</h3>
        <p className="text-sm text-slate-500">No attachments uploaded.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="mb-4 text-xl font-bold text-[#123A7A]">Attachments</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {attachments.map((file) => {
          const fileUrl = resolveBackendAssetUrl(file.fileUrl);
          const isImage = file.fileType?.startsWith("image/");

          return (
            <div
              key={file.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-[#F5F8FC] transition hover:shadow-md"
            >
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="block h-48 bg-slate-100"
                title={`Open ${file.fileName}`}
              >
                {isImage ? (
                  <img
                    src={fileUrl}
                    alt={file.fileName}
                    className="h-full w-full object-cover transition hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-medium text-slate-500">
                    Open file
                  </div>
                )}
              </a>

              <div className="p-4">
                <p className="truncate font-semibold text-[#123A7A]">
                  {file.fileName}
                </p>
                <p className="mt-1 text-xs text-slate-500">{file.fileType}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {Math.round((file.fileSize || 0) / 1024)} KB
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-[#2F80ED]"
                  >
                    Open file
                  </a>

                  {file.uploadedByUserId === currentUserId && onDeleteAttachment ? (
                    <button
                      type="button"
                      onClick={() => onDeleteAttachment(file.id)}
                      disabled={deletingAttachmentId === file.id}
                      className="text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingAttachmentId === file.id ? "Deleting..." : "Delete"}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TicketAttachmentGallery;
