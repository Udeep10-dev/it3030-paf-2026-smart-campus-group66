package com.sliit.group66.smartcampus.service;

import com.sliit.group66.smartcampus.dto.ticket.AttachmentResponse;
import com.sliit.group66.smartcampus.enums.UserRole;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileStorageService {
    AttachmentResponse uploadTicketAttachment(Long ticketId, MultipartFile file, Long currentUserId, UserRole currentUserRole);
    List<AttachmentResponse> getAttachmentsByTicket(Long ticketId, Long currentUserId, UserRole currentUserRole);
    void deleteAttachment(Long attachmentId, Long currentUserId, UserRole currentUserRole);
}
