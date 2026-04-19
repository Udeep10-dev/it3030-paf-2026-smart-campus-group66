package com.sliit.group66.smartcampus.service.impl;

import com.sliit.group66.smartcampus.dto.comment.CommentResponse;
import com.sliit.group66.smartcampus.dto.comment.CreateCommentRequest;
import com.sliit.group66.smartcampus.dto.comment.UpdateCommentRequest;
import com.sliit.group66.smartcampus.entity.Ticket;
import com.sliit.group66.smartcampus.entity.TicketComment;
import com.sliit.group66.smartcampus.entity.User;
import com.sliit.group66.smartcampus.exception.ForbiddenOperationException;
import com.sliit.group66.smartcampus.exception.ResourceNotFoundException;
import com.sliit.group66.smartcampus.repository.TicketCommentRepository;
import com.sliit.group66.smartcampus.repository.TicketRepository;
import com.sliit.group66.smartcampus.repository.UserRepository;
import com.sliit.group66.smartcampus.service.CommentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    private final TicketCommentRepository ticketCommentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public CommentServiceImpl(TicketCommentRepository ticketCommentRepository,
                              TicketRepository ticketRepository,
                              UserRepository userRepository) {
        this.ticketCommentRepository = ticketCommentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CommentResponse addComment(Long ticketId, CreateCommentRequest request, Long currentUserId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setUser(user);
        comment.setCommentText(request.getCommentText());

        return mapToResponse(ticketCommentRepository.save(comment));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByTicket(Long ticketId) {
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