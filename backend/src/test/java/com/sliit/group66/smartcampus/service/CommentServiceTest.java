package com.sliit.group66.smartcampus.service;

import com.sliit.group66.smartcampus.dto.comment.CreateCommentRequest;
import com.sliit.group66.smartcampus.dto.comment.UpdateCommentRequest;
import com.sliit.group66.smartcampus.entity.Ticket;
import com.sliit.group66.smartcampus.entity.TicketComment;
import com.sliit.group66.smartcampus.entity.User;
import com.sliit.group66.smartcampus.enums.UserRole;
import com.sliit.group66.smartcampus.exception.ForbiddenOperationException;
import com.sliit.group66.smartcampus.repository.TicketCommentRepository;
import com.sliit.group66.smartcampus.repository.TicketRepository;
import com.sliit.group66.smartcampus.repository.UserRepository;
import com.sliit.group66.smartcampus.service.impl.CommentServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private TicketCommentRepository ticketCommentRepository;

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private CommentServiceImpl commentService;

    @Test
    void studentCannotCommentOnAnotherUsersTicket() {
        Ticket ticket = new Ticket();
        ticket.setId(1L);
        ticket.setTicketNumber("TKT-1");
        ticket.setReportedBy(createUser(10L, UserRole.STUDENT));

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        CreateCommentRequest request = new CreateCommentRequest();
        request.setCommentText("Need more details");

        assertThrows(
                ForbiddenOperationException.class,
                () -> commentService.addComment(1L, request, 2L, UserRole.STUDENT)
        );
    }

    @Test
    void commentOwnerCanEditOwnComment() {
        User owner = createUser(1L, UserRole.STUDENT);
        TicketComment comment = new TicketComment();
        comment.setId(9L);
        comment.setUser(owner);
        comment.setCommentText("Old comment");
        comment.setTicket(new Ticket());

        when(ticketCommentRepository.findById(9L)).thenReturn(Optional.of(comment));
        when(ticketCommentRepository.save(any(TicketComment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateCommentRequest request = new UpdateCommentRequest();
        request.setCommentText("Updated comment");

        var response = commentService.updateComment(9L, request, 1L);

        assertEquals("Updated comment", response.getCommentText());
        assertTrue(response.isEdited());
        verify(ticketCommentRepository).save(comment);
    }

    @Test
    void adminCanCommentOnAnyTicket() {
        User admin = createUser(99L, UserRole.ADMIN);
        User reporter = createUser(10L, UserRole.STUDENT);

        Ticket ticket = new Ticket();
        ticket.setId(1L);
        ticket.setTicketNumber("TKT-1");
        ticket.setReportedBy(reporter);

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(userRepository.findById(99L)).thenReturn(Optional.of(admin));
        when(ticketCommentRepository.save(any(TicketComment.class))).thenAnswer(invocation -> {
            TicketComment saved = invocation.getArgument(0);
            saved.setId(5L);
            return saved;
        });

        CreateCommentRequest request = new CreateCommentRequest();
        request.setCommentText("Admin follow-up");

        var response = commentService.addComment(1L, request, 99L, UserRole.ADMIN);

        assertEquals("Admin follow-up", response.getCommentText());
        assertEquals(99L, response.getUserId());
        verify(ticketCommentRepository).save(any(TicketComment.class));
        verify(notificationService).createNotification(
                reporter.getId(),
                "New comment added to your ticket TKT-1.",
                com.sliit.group66.smartcampus.enums.NotificationType.GENERAL
        );
        verify(notificationService, never()).createNotification(
                admin.getId(),
                "New comment added to assigned ticket TKT-1.",
                com.sliit.group66.smartcampus.enums.NotificationType.GENERAL
        );
    }

    @Test
    void nonOwnerCannotDeleteComment() {
        User owner = createUser(1L, UserRole.STUDENT);
        TicketComment comment = new TicketComment();
        comment.setId(9L);
        comment.setUser(owner);

        when(ticketCommentRepository.findById(9L)).thenReturn(Optional.of(comment));

        assertThrows(
                ForbiddenOperationException.class,
                () -> commentService.deleteComment(9L, 2L)
        );
    }

    private User createUser(Long id, UserRole role) {
        User user = new User();
        user.setId(id);
        user.setName("User " + id);
        user.setEmail("user" + id + "@example.com");
        user.setRole(role);
        return user;
    }
}
