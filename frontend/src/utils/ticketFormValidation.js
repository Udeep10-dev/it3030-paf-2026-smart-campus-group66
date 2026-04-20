export const MAX_TICKET_ATTACHMENTS = 3;
export const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;

const ALLOWED_ATTACHMENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export function validatePreferredContact(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+\d][\d\s-]{7,19}$/;

  if (!emailPattern.test(trimmed) && !phonePattern.test(trimmed)) {
    return "Enter a valid email address or phone number.";
  }

  return "";
}

export function validateTicketForm(form) {
  const errors = {};
  const description = form.description.trim();
  const location = form.location.trim();

  if (!form.resourceId && !location) {
    errors.location = "Select a resource or provide a location.";
  }

  if (!form.category) {
    errors.category = "Please choose a ticket category.";
  }

  if (!form.priority) {
    errors.priority = "Please choose a priority level.";
  }

  if (!description) {
    errors.description = "Please describe the issue.";
  } else if (description.length < 10) {
    errors.description = "Description must be at least 10 characters.";
  } else if (description.length > 1000) {
    errors.description = "Description must be 1000 characters or fewer.";
  }

  const preferredContactError = validatePreferredContact(form.preferredContact);
  if (preferredContactError) {
    errors.preferredContact = preferredContactError;
  }

  return errors;
}

export function validateAttachmentFiles(files, remainingSlots = MAX_TICKET_ATTACHMENTS) {
  if (!files.length) {
    return "";
  }

  if (files.length > remainingSlots) {
    return `You can upload up to ${remainingSlots} attachment(s).`;
  }

  const invalidTypeFile = files.find(
    (file) => !ALLOWED_ATTACHMENT_TYPES.includes(file.type)
  );
  if (invalidTypeFile) {
    return `${invalidTypeFile.name} is not a supported image type.`;
  }

  const oversizeFile = files.find(
    (file) => file.size > MAX_ATTACHMENT_SIZE_BYTES
  );
  if (oversizeFile) {
    return `${oversizeFile.name} exceeds the 10 MB size limit.`;
  }

  return "";
}

export function validateAssignForm(assignedToUserId) {
  if (!assignedToUserId) {
    return "Please select a staff or admin user.";
  }

  return "";
}

export function validateStatusForm(statusForm) {
  const errors = {};

  if (!statusForm.status) {
    errors.status = "Please select the next status.";
  }

  if (statusForm.status === "REJECTED") {
    const reason = statusForm.rejectionReason.trim();
    if (!reason) {
      errors.rejectionReason = "Rejection reason is required.";
    } else if (reason.length < 5) {
      errors.rejectionReason = "Rejection reason must be at least 5 characters.";
    }
  }

  if (statusForm.status === "RESOLVED") {
    const notes = statusForm.resolutionNotes.trim();
    if (!notes) {
      errors.resolutionNotes = "Resolution notes are required.";
    } else if (notes.length < 5) {
      errors.resolutionNotes = "Resolution notes must be at least 5 characters.";
    }
  }

  return errors;
}

export function validateCommentText(text, label = "Comment") {
  const trimmed = text.trim();

  if (!trimmed) {
    return `${label} cannot be empty.`;
  }

  if (trimmed.length < 2) {
    return `${label} must be at least 2 characters.`;
  }

  if (trimmed.length > 500) {
    return `${label} must be 500 characters or fewer.`;
  }

  return "";
}
