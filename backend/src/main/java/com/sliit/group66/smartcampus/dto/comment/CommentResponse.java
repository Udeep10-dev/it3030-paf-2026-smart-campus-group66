package com.sliit.group66.smartcampus.dto.comment;

import java.time.LocalDateTime;

public class CommentResponse {

    private Long id;
    private Long ticketId;
    private Long userId;
    private String commentText;
    private boolean edited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public Long getTicketId() { return ticketId; }
    public Long getUserId() { return userId; }
    public String getCommentText() { return commentText; }
    public boolean isEdited() { return edited; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(Long id) { this.id = id; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setCommentText(String commentText) { this.commentText = commentText; }
    public void setEdited(boolean edited) { this.edited = edited; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}