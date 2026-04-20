package com.sliit.group66.smartcampus.service;

import com.sliit.group66.smartcampus.dto.comment.*;
import com.sliit.group66.smartcampus.enums.UserRole;

import java.util.List;

public interface CommentService {
    CommentResponse addComment(Long ticketId, CreateCommentRequest request, Long currentUserId, UserRole currentUserRole);
    List<CommentResponse> getCommentsByTicket(Long ticketId, Long currentUserId, UserRole currentUserRole);
    CommentResponse updateComment(Long commentId, UpdateCommentRequest request, Long currentUserId);
    void deleteComment(Long commentId, Long currentUserId);
}
