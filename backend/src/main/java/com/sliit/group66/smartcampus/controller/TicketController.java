package com.sliit.group66.smartcampus.controller;

import com.sliit.group66.smartcampus.dto.ticket.*;
import com.sliit.group66.smartcampus.entity.User;
import com.sliit.group66.smartcampus.enums.TicketPriority;
import com.sliit.group66.smartcampus.enums.TicketStatus;
import com.sliit.group66.smartcampus.security.AuthenticatedUserService;
import com.sliit.group66.smartcampus.service.FileStorageService;
import com.sliit.group66.smartcampus.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final FileStorageService fileStorageService;
    private final AuthenticatedUserService authenticatedUserService;

    public TicketController(TicketService ticketService,
                            FileStorageService fileStorageService,
                            AuthenticatedUserService authenticatedUserService) {
        this.ticketService = ticketService;
        this.fileStorageService = fileStorageService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(@Valid @RequestBody CreateTicketRequest request,
                                                       Authentication authentication) {
        User currentUser = authenticatedUserService.getCurrentUser(authentication);
        TicketResponse response = ticketService.createTicket(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id,
                                                        Authentication authentication) {
        User currentUser = authenticatedUserService.getCurrentUser(authentication);
        return ResponseEntity.ok(ticketService.getTicketById(id, currentUser.getId(), currentUser.getRole()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketResponse>> getMyTickets(Authentication authentication) {
        User currentUser = authenticatedUserService.getCurrentUser(authentication);
        return ResponseEntity.ok(ticketService.getMyTickets(currentUser.getId()));
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority,
            Authentication authentication) {
        User currentUser = authenticatedUserService.getCurrentUser(authentication);
        return ResponseEntity.ok(ticketService.getAllTickets(status, priority, currentUser.getId(), currentUser.getRole()));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<TicketResponse> assignTicket(
            @PathVariable Long id,
            @Valid @RequestBody AssignTicketRequest request,
            Authentication authentication) {
        User currentUser = authenticatedUserService.getCurrentUser(authentication);
        return ResponseEntity.ok(ticketService.assignTicket(id, request, currentUser.getId(), currentUser.getRole()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusRequest request,
            Authentication authentication) {
        User currentUser = authenticatedUserService.getCurrentUser(authentication);
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, request, currentUser.getId(), currentUser.getRole()));
    }

    @PostMapping(value = "/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AttachmentResponse> uploadAttachment(
            @PathVariable Long id,
            @RequestPart("file") MultipartFile file,
            Authentication authentication) {
        User currentUser = authenticatedUserService.getCurrentUser(authentication);
        AttachmentResponse response = fileStorageService.uploadTicketAttachment(id, file, currentUser.getId(), currentUser.getRole());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/attachments")
    public ResponseEntity<List<AttachmentResponse>> getAttachments(@PathVariable Long id,
                                                                   Authentication authentication) {
        User currentUser = authenticatedUserService.getCurrentUser(authentication);
        return ResponseEntity.ok(fileStorageService.getAttachmentsByTicket(id, currentUser.getId(), currentUser.getRole()));
    }

    @DeleteMapping("/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long attachmentId,
                                                 Authentication authentication) {
        User currentUser = authenticatedUserService.getCurrentUser(authentication);
        fileStorageService.deleteAttachment(attachmentId, currentUser.getId(), currentUser.getRole());
        return ResponseEntity.noContent().build();
    }
}
