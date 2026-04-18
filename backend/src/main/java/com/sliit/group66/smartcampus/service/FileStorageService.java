package com.sliit.group66.smartcampus.service;

import com.sliit.group66.smartcampus.dto.ticket.AttachmentResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileStorageService {
    AttachmentResponse uploadTicketAttachment(Long ticketId, MultipartFile file, Long currentUserId);
    List<AttachmentResponse> getAttachmentsByTicket(Long ticketId);
    void deleteAttachment(Long attachmentId, Long currentUserId);
}