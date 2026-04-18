package com.sliit.group66.smartcampus.service.impl;

import com.sliit.group66.smartcampus.dto.ticket.AttachmentResponse;
import com.sliit.group66.smartcampus.entity.Ticket;
import com.sliit.group66.smartcampus.entity.TicketAttachment;
import com.sliit.group66.smartcampus.entity.User;
import com.sliit.group66.smartcampus.exception.BadRequestException;
import com.sliit.group66.smartcampus.exception.ForbiddenOperationException;
import com.sliit.group66.smartcampus.exception.ResourceNotFoundException;
import com.sliit.group66.smartcampus.repository.TicketAttachmentRepository;
import com.sliit.group66.smartcampus.repository.TicketRepository;
import com.sliit.group66.smartcampus.repository.UserRepository;
import com.sliit.group66.smartcampus.service.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class FileStorageServiceImpl implements FileStorageService {

    private final TicketAttachmentRepository ticketAttachmentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final Path uploadDir = Paths.get("uploads/tickets");

    public FileStorageServiceImpl(TicketAttachmentRepository ticketAttachmentRepository,
                                  TicketRepository ticketRepository,
                                  UserRepository userRepository) throws IOException {
        this.ticketAttachmentRepository = ticketAttachmentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        Files.createDirectories(uploadDir);
    }

    @Override
    public AttachmentResponse uploadTicketAttachment(Long ticketId, MultipartFile file, Long currentUserId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long count = ticketAttachmentRepository.countByTicketId(ticketId);
        if (count >= 3) {
            throw new BadRequestException("Maximum 3 attachments allowed per ticket");
        }

        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null ||
                !(contentType.equals("image/png")
                        || contentType.equals("image/jpeg")
                        || contentType.equals("image/jpg")
                        || contentType.equals("image/webp"))) {
            throw new BadRequestException("Only image files are allowed");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("File size must be less than 5MB");
        }

        String originalName = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
        String safeName = originalName.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
        String generatedName = UUID.randomUUID() + "_" + safeName;

        try {
            Files.copy(file.getInputStream(), uploadDir.resolve(generatedName), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new BadRequestException("Failed to store file");
        }

        TicketAttachment attachment = new TicketAttachment();
        attachment.setTicket(ticket);
        attachment.setUploadedBy(user);
        attachment.setFileName(safeName);
        attachment.setFileType(contentType);
        attachment.setFileSize(file.getSize());
        attachment.setFileUrl("/uploads/tickets/" + generatedName);

        return mapToResponse(ticketAttachmentRepository.save(attachment));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttachmentResponse> getAttachmentsByTicket(Long ticketId) {
        return ticketAttachmentRepository.findByTicketId(ticketId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void deleteAttachment(Long attachmentId, Long currentUserId) {
        TicketAttachment attachment = ticketAttachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));

        if (!attachment.getUploadedBy().getId().equals(currentUserId)) {
            throw new ForbiddenOperationException("You can only delete your own attachment");
        }

        String fileUrl = attachment.getFileUrl();
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

        try {
            Files.deleteIfExists(uploadDir.resolve(fileName));
        } catch (IOException ignored) {
        }

        ticketAttachmentRepository.delete(attachment);
    }

    private AttachmentResponse mapToResponse(TicketAttachment attachment) {
        AttachmentResponse response = new AttachmentResponse();
        response.setId(attachment.getId());
        response.setTicketId(attachment.getTicket().getId());
        response.setUploadedByUserId(attachment.getUploadedBy().getId());
        response.setFileName(attachment.getFileName());
        response.setFileType(attachment.getFileType());
        response.setFileUrl(attachment.getFileUrl());
        response.setFileSize(attachment.getFileSize());
        response.setCreatedAt(attachment.getCreatedAt());
        return response;
    }
}