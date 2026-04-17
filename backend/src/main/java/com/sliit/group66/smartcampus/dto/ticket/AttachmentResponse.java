package com.sliit.group66.smartcampus.dto.ticket;

import java.time.LocalDateTime;

public class AttachmentResponse {

    private Long id;
    private Long ticketId;
    private Long uploadedByUserId;
    private String fileName;
    private String fileType;
    private String fileUrl;
    private Long fileSize;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public Long getTicketId() { return ticketId; }
    public Long getUploadedByUserId() { return uploadedByUserId; }
    public String getFileName() { return fileName; }
    public String getFileType() { return fileType; }
    public String getFileUrl() { return fileUrl; }
    public Long getFileSize() { return fileSize; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setTicketId(Long ticketId) { this.ticketId = ticketId; }
    public void setUploadedByUserId(Long uploadedByUserId) { this.uploadedByUserId = uploadedByUserId; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}