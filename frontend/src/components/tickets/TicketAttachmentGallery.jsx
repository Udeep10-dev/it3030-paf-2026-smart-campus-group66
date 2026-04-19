function TicketAttachmentGallery({ attachments = [] }) {
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
        {attachments.map((file) => (
          <a
            key={file.id}
            href={file.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-[#F5F8FC] transition hover:shadow-md"
          >
            <div className="flex h-40 items-center justify-center bg-slate-100">
              {file.fileType?.startsWith("image/") ? (
                <img
                  src={file.fileUrl}
                  alt={file.fileName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-slate-500">
                  File Preview
                </span>
              )}
            </div>

            <div className="p-4">
              <p className="truncate font-semibold text-[#123A7A]">
                {file.fileName}
              </p>
              <p className="mt-1 text-xs text-slate-500">{file.fileType}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default TicketAttachmentGallery;