package com.sliit.group66.smartcampus.service.impl;

import com.sliit.group66.smartcampus.dto.comment.CommentResponse;
import com.sliit.group66.smartcampus.dto.comment.CreateCommentRequest;
import com.sliit.group66.smartcampus.dto.comment.UpdateCommentRequest;
import com.sliit.group66.smartcampus.entity.Ticket;
import com.sliit.group66.smartcampus.entity.TicketComment;
import com.sliit.group66.smartcampus.entity.User;
import com.sliit.group66.smartcampus.enums.NotificationType;
import com.sliit.group66.smartcampus.enums.UserRole;
import com.sliit.group66.smartcampus.exception.ForbiddenOperationException;
import com.sliit.group66.smartcampus.exception.ResourceNotFoundException;
import com.sliit.group66.smartcampus.repository.TicketCommentRepository;
import com.sliit.group66.smartcampus.repository.TicketRepository;
import com.sliit.group66.smartcampus.repository.UserRepository;
import com.sliit.group66.smartcampus.service.CommentService;
import com.sliit.group66.smartcampus.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    private final TicketCommentRepository ticketCommentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public CommentServiceImpl(TicketCommentRepository ticketCommentRepository,
                              TicketRepository ticketRepository,
                              UserRepository userRepository,
                              NotificationService notificationService) {
        this.ticketCommentRepository = ticketCommentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    public CommentResponse addComment(Long ticketId, CreateCommentRequest request, Long currentUserId, UserRole currentUserRole) {
        Ticket ticket = getAccessibleTicket(ticketId, currentUserId, currentUserRole);

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setUser(user);
        comment.setCommentText(request.getCommentText());

        TicketComment savedComment = ticketCommentRepository.save(comment);

        if (ticket.getReportedBy() != null && !ticket.getReportedBy().getId().equals(currentUserId)) {
            notifySafely(
                    ticket.getReportedBy().getId(),
                    "New comment added to your ticket " + ticket.getTicketNumber() + ".",
                    NotificationType.GENERAL
            );
        }

        if (ticket.getAssignedTo() != null && !ticket.getAssignedTo().getId().equals(currentUserId)) {
            notifySafely(
                    ticket.getAssignedTo().getId(),
                    "New comment added to assigned ticket " + ticket.getTicketNumber() + ".",
                    NotificationType.GENERAL
            );
        }

        return mapToResponse(savedComment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByTicket(Long ticketId, Long currentUserId, UserRole currentUserRole) {
        getAccessibleTicket(ticketId, currentUserId, currentUserRole);

        return ticketCommentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CommentResponse updateComment(Long commentId, UpdateCommentRequest request, Long currentUserId) {
        TicketComment comment = ticketCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUserId)) {
            throw new ForbiddenOperationException("You can only edit your own comments");
        }

        comment.setCommentText(request.getCommentText());
        comment.setEdited(true);

        return mapToResponse(ticketCommentRepository.save(comment));
    }

    @Override
    public void deleteComment(Long commentId, Long currentUserId) {
        TicketComment comment = ticketCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUserId)) {
            throw new ForbiddenOperationException("You can only delete your own comments");
        }

        ticketCommentRepository.delete(comment);
    }

    private Ticket getAccessibleTicket(Long ticketId, Long currentUserId, UserRole currentUserRole) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        if (currentUserRole == UserRole.ADMIN || currentUserRole == UserRole.STAFF) {
            return ticket;
        }

        if (ticket.getReportedBy() != null && ticket.getReportedBy().getId().equals(currentUserId)) {
            return ticket;
        }

        throw new ForbiddenOperationException("You can only comment on your own tickets");
    }

    private void notifySafely(Long userId, String message, NotificationType type) {
        try {
            notificationService.createNotification(userId, message, type);
        } catch (Exception ignored) {
        }
    }

    private CommentResponse mapToResponse(TicketComment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setTicketId(comment.getTicket().getId());
        response.setUserId(comment.getUser().getId());
        response.setCommentText(comment.getCommentText());
        response.setEdited(comment.isEdited());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        return response;
    }
}
