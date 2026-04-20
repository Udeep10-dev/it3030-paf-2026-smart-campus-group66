package com.sliit.group66.smartcampus.service;

import com.sliit.group66.smartcampus.dto.ticket.*;
import com.sliit.group66.smartcampus.enums.TicketPriority;
import com.sliit.group66.smartcampus.enums.TicketStatus;
import com.sliit.group66.smartcampus.enums.UserRole;

import java.util.List;

public interface TicketService {
    TicketResponse createTicket(CreateTicketRequest request, Long currentUserId);
    TicketResponse getTicketById(Long ticketId, Long currentUserId, UserRole currentUserRole);
    List<TicketResponse> getMyTickets(Long currentUserId);
    List<TicketResponse> getAllTickets(TicketStatus status, TicketPriority priority, Long currentUserId, UserRole currentUserRole);
    TicketResponse assignTicket(Long ticketId, AssignTicketRequest request, Long currentUserId, UserRole currentUserRole);
    TicketResponse updateTicketStatus(Long ticketId, UpdateTicketStatusRequest request, Long currentUserId, UserRole currentUserRole);
}
