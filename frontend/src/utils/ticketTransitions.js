export const TICKET_STATUS_TRANSITIONS = {
  OPEN: ["IN_PROGRESS", "REJECTED"],
  IN_PROGRESS: ["RESOLVED", "REJECTED"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
  REJECTED: [],
};

export function getNextTicketStatuses(status) {
  return TICKET_STATUS_TRANSITIONS[status] || [];
}
