package com.sliit.group66.smartcampus.service.impl;

import com.sliit.group66.smartcampus.dto.ticket.AssignTicketRequest;
import com.sliit.group66.smartcampus.dto.ticket.CreateTicketRequest;
import com.sliit.group66.smartcampus.dto.ticket.TicketResponse;
import com.sliit.group66.smartcampus.dto.ticket.UpdateTicketStatusRequest;
import com.sliit.group66.smartcampus.entity.Resource;
import com.sliit.group66.smartcampus.entity.Ticket;
import com.sliit.group66.smartcampus.entity.User;
import com.sliit.group66.smartcampus.enums.NotificationType;
import com.sliit.group66.smartcampus.enums.TicketPriority;
import com.sliit.group66.smartcampus.enums.TicketStatus;
import com.sliit.group66.smartcampus.enums.UserRole;
import com.sliit.group66.smartcampus.exception.BadRequestException;
import com.sliit.group66.smartcampus.exception.ForbiddenOperationException;
import com.sliit.group66.smartcampus.exception.ResourceNotFoundException;
import com.sliit.group66.smartcampus.repository.ResourceRepository;
import com.sliit.group66.smartcampus.repository.TicketRepository;
import com.sliit.group66.smartcampus.repository.UserRepository;
import com.sliit.group66.smartcampus.service.NotificationService;
import com.sliit.group66.smartcampus.service.TicketService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    public TicketServiceImpl(TicketRepository ticketRepository,
                             UserRepository userRepository,
                             ResourceRepository resourceRepository,
                             NotificationService notificationService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
        this.notificationService = notificationService;
    }

    @Override
    public TicketResponse createTicket(CreateTicketRequest request, Long currentUserId) {
        User reportedBy = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getResourceId() == null &&
                (request.getLocation() == null || request.getLocation().isBlank())) {
            throw new BadRequestException("Either resourceId or location must be provided");
        }

        Ticket ticket = new Ticket();
        ticket.setReportedBy(reportedBy);
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setPreferredContact(request.getPreferredContact());
        ticket.setLocation(request.getLocation());
        ticket.setStatus(TicketStatus.OPEN);

        if (request.getResourceId() != null) {
            Resource resource = resourceRepository.findById(request.getResourceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
            ticket.setResource(resource);
        }

        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToResponse(savedTicket);
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long ticketId, Long currentUserId, UserRole currentUserRole) {
        Ticket ticket = getAccessibleTicket(ticketId, currentUserId, currentUserRole);
        return mapToResponse(ticket);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponse> getMyTickets(Long currentUserId) {
        return ticketRepository.findByReportedById(currentUserId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets(TicketStatus status, TicketPriority priority, Long currentUserId, UserRole currentUserRole) {
        ensureStaffOrAdmin(currentUserRole, "Only staff or admin can view all tickets");

        List<Ticket> tickets;

        if (status != null && priority != null) {
            tickets = ticketRepository.findByStatusAndPriority(status, priority);
        } else if (status != null) {
            tickets = ticketRepository.findByStatus(status);
        } else if (priority != null) {
            tickets = ticketRepository.findByPriority(priority);
        } else {
            tickets = ticketRepository.findAll();
        }

        return tickets.stream().map(this::mapToResponse).toList();
    }

    @Override
    public TicketResponse assignTicket(Long ticketId, AssignTicketRequest request, Long currentUserId, UserRole currentUserRole) {
        ensureStaffOrAdmin(currentUserRole, "Only staff or admin can assign tickets");

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        if (ticket.getStatus() == TicketStatus.CLOSED || ticket.getStatus() == TicketStatus.REJECTED) {
            throw new BadRequestException("Closed or rejected tickets cannot be assigned");
        }

        User assignedUser = userRepository.findById(request.getAssignedToUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

        if (assignedUser.getRole() != UserRole.STAFF && assignedUser.getRole() != UserRole.ADMIN) {
            throw new BadRequestException("Tickets can only be assigned to staff or admin users");
        }

        ticket.setAssignedTo(assignedUser);

        Ticket updatedTicket = ticketRepository.save(ticket);

        notifySafely(
                assignedUser.getId(),
                "You have been assigned ticket " + updatedTicket.getTicketNumber() + ".",
                NotificationType.TICKET_ASSIGNED
        );

        if (updatedTicket.getReportedBy() != null && !updatedTicket.getReportedBy().getId().equals(currentUserId)) {
            notifySafely(
                    updatedTicket.getReportedBy().getId(),
                    "Your ticket " + updatedTicket.getTicketNumber() + " has been assigned.",
                    NotificationType.TICKET_UPDATED
            );
        }

        return mapToResponse(updatedTicket);
    }

    @Override
    public TicketResponse updateTicketStatus(Long ticketId, UpdateTicketStatusRequest request, Long currentUserId, UserRole currentUserRole) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        ensureCanUpdateStatus(ticket, currentUserId, currentUserRole, request.getStatus());
        validateStatusTransition(ticket.getStatus(), request.getStatus());

        if (request.getStatus() == TicketStatus.REJECTED &&
                (request.getRejectionReason() == null || request.getRejectionReason().isBlank())) {
            throw new BadRequestException("Rejection reason is required");
        }

        if (request.getStatus() == TicketStatus.RESOLVED &&
                (request.getResolutionNotes() == null || request.getResolutionNotes().isBlank())) {
            throw new BadRequestException("Resolution notes are required");
        }

        ticket.setStatus(request.getStatus());
        ticket.setRejectionReason(request.getRejectionReason());
        ticket.setResolutionNotes(request.getResolutionNotes());

        if (request.getStatus() == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        if (request.getStatus() == TicketStatus.CLOSED) {
            ticket.setClosedAt(LocalDateTime.now());
        }

        Ticket updatedTicket = ticketRepository.save(ticket);

        if (updatedTicket.getReportedBy() != null) {
            notifySafely(
                    updatedTicket.getReportedBy().getId(),
                    "Your ticket " + updatedTicket.getTicketNumber() + " is now " + updatedTicket.getStatus() + ".",
                    NotificationType.TICKET_UPDATED
            );
        }

        return mapToResponse(updatedTicket);
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

        throw new ForbiddenOperationException("You can only access your own tickets");
    }

    private void ensureStaffOrAdmin(UserRole currentUserRole, String message) {
        if (currentUserRole != UserRole.STAFF && currentUserRole != UserRole.ADMIN) {
            throw new ForbiddenOperationException(message);
        }
    }

    private void ensureCanUpdateStatus(Ticket ticket, Long currentUserId, UserRole currentUserRole, TicketStatus nextStatus) {
        if (currentUserRole == UserRole.ADMIN) {
            return;
        }

        if (nextStatus == TicketStatus.REJECTED) {
            throw new ForbiddenOperationException("Only admin can reject tickets");
        }

        if (currentUserRole != UserRole.STAFF) {
            throw new ForbiddenOperationException("Only staff or admin can update ticket status");
        }

        if (ticket.getAssignedTo() == null || !ticket.getAssignedTo().getId().equals(currentUserId)) {
            throw new ForbiddenOperationException("Only the assigned staff member can update this ticket");
        }
    }

    private void notifySafely(Long userId, String message, NotificationType type) {
        try {
            notificationService.createNotification(userId, message, type);
        } catch (Exception ignored) {
        }
    }

    private void validateStatusTransition(TicketStatus current, TicketStatus next) {
        boolean valid = switch (current) {
            case OPEN -> next == TicketStatus.IN_PROGRESS || next == TicketStatus.REJECTED;
            case IN_PROGRESS -> next == TicketStatus.RESOLVED || next == TicketStatus.REJECTED;
            case RESOLVED -> next == TicketStatus.CLOSED;
            case CLOSED, REJECTED -> false;
        };

        if (!valid) {
            throw new BadRequestException("Invalid ticket status transition: " + current + " -> " + next);
        }
    }

    private TicketResponse mapToResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setTicketNumber(ticket.getTicketNumber());
        response.setLocation(ticket.getLocation());
        response.setCategory(ticket.getCategory());
        response.setDescription(ticket.getDescription());
        response.setPriority(ticket.getPriority());
        response.setPreferredContact(ticket.getPreferredContact());
        response.setStatus(ticket.getStatus());
        response.setRejectionReason(ticket.getRejectionReason());
        response.setResolutionNotes(ticket.getResolutionNotes());
        response.setResolvedAt(ticket.getResolvedAt());
        response.setClosedAt(ticket.getClosedAt());
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());

        if (ticket.getResource() != null) {
            response.setResourceId(ticket.getResource().getId());
        }
        if (ticket.getReportedBy() != null) {
            response.setReportedByUserId(ticket.getReportedBy().getId());
        }
        if (ticket.getAssignedTo() != null) {
            response.setAssignedToUserId(ticket.getAssignedTo().getId());
        }

        return response;
    }
}
