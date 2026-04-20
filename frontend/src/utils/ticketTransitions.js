export const TICKET_STATUS_TRANSITIONS = {
  OPEN: ["IN_PROGRESS", "REJECTED"],
  IN_PROGRESS: ["RESOLVED", "REJECTED"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
  REJECTED: [],
};

export function getNextTicketStatuses(status, role = "") {
  const transitions = TICKET_STATUS_TRANSITIONS[status] || [];

  if ((role || "").toUpperCase() === "ADMIN") {
    return transitions;
  }

  return transitions.filter((nextStatus) => nextStatus !== "REJECTED");
}
