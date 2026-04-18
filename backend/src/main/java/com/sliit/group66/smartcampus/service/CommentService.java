package com.sliit.group66.smartcampus.service;

import com.sliit.group66.smartcampus.dto.comment.*;

import java.util.List;

public interface CommentService {
    CommentResponse addComment(Long ticketId, CreateCommentRequest request, Long currentUserId);
    List<CommentResponse> getCommentsByTicket(Long ticketId);
    CommentResponse updateComment(Long commentId, UpdateCommentRequest request, Long currentUserId);
    void deleteComment(Long commentId, Long currentUserId);
}