package com.sliit.group66.smartcampus.dto.ticket;

import com.sliit.group66.smartcampus.enums.TicketCategory;
import com.sliit.group66.smartcampus.enums.TicketPriority;
import com.sliit.group66.smartcampus.enums.TicketStatus;

import java.time.LocalDateTime;

public class TicketResponse {

    private Long id;
    private String ticketNumber;
    private Long resourceId;
    private String location;
    private Long reportedByUserId;
    private Long assignedToUserId;
    private TicketCategory category;
    private String description;
    private TicketPriority priority;
    private String preferredContact;
    private TicketStatus status;
    private String rejectionReason;
    private String resolutionNotes;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public String getTicketNumber() { return ticketNumber; }
    public Long getResourceId() { return resourceId; }
    public String getLocation() { return location; }
    public Long getReportedByUserId() { return reportedByUserId; }
    public Long getAssignedToUserId() { return assignedToUserId; }
    public TicketCategory getCategory() { return category; }
    public String getDescription() { return description; }
    public TicketPriority getPriority() { return priority; }
    public String getPreferredContact() { return preferredContact; }
    public TicketStatus getStatus() { return status; }
    public String getRejectionReason() { return rejectionReason; }
    public String getResolutionNotes() { return resolutionNotes; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public LocalDateTime getClosedAt() { return closedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(Long id) { this.id = id; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }
    public void setResourceId(Long resourceId) { this.resourceId = resourceId; }
    public void setLocation(String location) { this.location = location; }
    public void setReportedByUserId(Long reportedByUserId) { this.reportedByUserId = reportedByUserId; }
    public void setAssignedToUserId(Long assignedToUserId) { this.assignedToUserId = assignedToUserId; }
    public void setCategory(TicketCategory category) { this.category = category; }
    public void setDescription(String description) { this.description = description; }
    public void setPriority(TicketPriority priority) { this.priority = priority; }
    public void setPreferredContact(String preferredContact) { this.preferredContact = preferredContact; }
    public void setStatus(TicketStatus status) { this.status = status; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}