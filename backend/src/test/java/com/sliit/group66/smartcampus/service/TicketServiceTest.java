package com.sliit.group66.smartcampus.service;

import com.sliit.group66.smartcampus.dto.ticket.AssignTicketRequest;
import com.sliit.group66.smartcampus.dto.ticket.CreateTicketRequest;
import com.sliit.group66.smartcampus.dto.ticket.TicketResponse;
import com.sliit.group66.smartcampus.dto.ticket.UpdateTicketStatusRequest;
import com.sliit.group66.smartcampus.entity.Ticket;
import com.sliit.group66.smartcampus.entity.User;
import com.sliit.group66.smartcampus.enums.NotificationType;
import com.sliit.group66.smartcampus.enums.TicketCategory;
import com.sliit.group66.smartcampus.enums.TicketPriority;
import com.sliit.group66.smartcampus.enums.TicketStatus;
import com.sliit.group66.smartcampus.enums.UserRole;
import com.sliit.group66.smartcampus.exception.BadRequestException;
import com.sliit.group66.smartcampus.exception.ForbiddenOperationException;
import com.sliit.group66.smartcampus.repository.ResourceRepository;
import com.sliit.group66.smartcampus.repository.TicketRepository;
import com.sliit.group66.smartcampus.repository.UserRepository;
import com.sliit.group66.smartcampus.service.impl.TicketServiceImpl;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ResourceRepository resourceRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private TicketServiceImpl ticketService;

    @Test
    void createTicketRequiresResourceOrLocation() {
        User reporter = createUser(1L, UserRole.STUDENT);
        when(userRepository.findById(1L)).thenReturn(Optional.of(reporter));

        CreateTicketRequest request = new CreateTicketRequest();
        request.setCategory(TicketCategory.PROJECTOR);
        request.setDescription("Projector is not working");
        request.setPriority(TicketPriority.HIGH);

        assertThrows(BadRequestException.class, () -> ticketService.createTicket(request, 1L));
    }

    @Test
    void getAllTicketsRejectsStudents() {
        assertThrows(
                ForbiddenOperationException.class,
                () -> ticketService.getAllTickets(null, null, 1L, UserRole.STUDENT)
        );
    }

    @Test
    void assignTicketRejectsStudentAssignee() {
        Ticket ticket = createTicket(1L, TicketStatus.OPEN, createUser(10L, UserRole.STUDENT), null);
        User studentAssignee = createUser(2L, UserRole.STUDENT);

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(userRepository.findById(2L)).thenReturn(Optional.of(studentAssignee));

        AssignTicketRequest request = new AssignTicketRequest();
        request.setAssignedToUserId(2L);

        assertThrows(
                BadRequestException.class,
                () -> ticketService.assignTicket(1L, request, 99L, UserRole.ADMIN)
        );
    }

    @Test
    void staffMustBeAssignedToUpdateTicketStatus() {
        Ticket ticket = createTicket(1L, TicketStatus.OPEN, createUser(10L, UserRole.STUDENT), null);
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        UpdateTicketStatusRequest request = new UpdateTicketStatusRequest();
        request.setStatus(TicketStatus.IN_PROGRESS);

        assertThrows(
                ForbiddenOperationException.class,
                () -> ticketService.updateTicketStatus(1L, request, 50L, UserRole.STAFF)
        );
    }

    @Test
    void adminCanRejectTicketWithReason() {
        User reporter = createUser(10L, UserRole.STUDENT);
        Ticket ticket = createTicket(1L, TicketStatus.OPEN, reporter, null);

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateTicketStatusRequest request = new UpdateTicketStatusRequest();
        request.setStatus(TicketStatus.REJECTED);
        request.setRejectionReason("Invalid request");

        TicketResponse response = ticketService.updateTicketStatus(1L, request, 99L, UserRole.ADMIN);

        assertEquals(TicketStatus.REJECTED, response.getStatus());
        assertEquals("Invalid request", response.getRejectionReason());
        verify(notificationService).createNotification(
                eq(reporter.getId()),
                eq("Your ticket TKT-1 is now REJECTED."),
                eq(NotificationType.TICKET_UPDATED)
        );
    }

    @Test
    void assignedStaffCanResolveTicketWithResolutionNotes() {
        User reporter = createUser(10L, UserRole.STUDENT);
        User staff = createUser(20L, UserRole.STAFF);
        Ticket ticket = createTicket(1L, TicketStatus.IN_PROGRESS, reporter, staff);

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateTicketStatusRequest request = new UpdateTicketStatusRequest();
        request.setStatus(TicketStatus.RESOLVED);
        request.setResolutionNotes("Replaced HDMI cable");

        TicketResponse response = ticketService.updateTicketStatus(1L, request, 20L, UserRole.STAFF);

        assertEquals(TicketStatus.RESOLVED, response.getStatus());
        assertEquals("Replaced HDMI cable", response.getResolutionNotes());
        assertTrue(ticket.getResolvedAt() != null);
    }

    private User createUser(Long id, UserRole role) {
        User user = new User();
        user.setId(id);
        user.setName("User " + id);
        user.setEmail("user" + id + "@example.com");
        user.setRole(role);
        return user;
    }

    private Ticket createTicket(Long id, TicketStatus status, User reporter, User assignee) {
        Ticket ticket = new Ticket();
        ticket.setId(id);
        ticket.setTicketNumber("TKT-" + id);
        ticket.setStatus(status);
        ticket.setReportedBy(reporter);
        ticket.setAssignedTo(assignee);
        ticket.setCategory(TicketCategory.PROJECTOR);
        ticket.setDescription("Projector issue");
        ticket.setPriority(TicketPriority.HIGH);
        return ticket;
    }
}
