package com.sliit.group66.smartcampus.service;

import com.sliit.group66.smartcampus.dto.ticket.*;
import com.sliit.group66.smartcampus.enums.TicketPriority;
import com.sliit.group66.smartcampus.enums.TicketStatus;

import java.util.List;

public interface TicketService {
    TicketResponse createTicket(CreateTicketRequest request, Long currentUserId);
    TicketResponse getTicketById(Long ticketId);
    List<TicketResponse> getMyTickets(Long currentUserId);
    List<TicketResponse> getAllTickets(TicketStatus status, TicketPriority priority);
    TicketResponse assignTicket(Long ticketId, AssignTicketRequest request);
    TicketResponse updateTicketStatus(Long ticketId, UpdateTicketStatusRequest request);
}