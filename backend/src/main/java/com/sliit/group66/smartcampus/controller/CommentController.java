package com.sliit.group66.smartcampus.controller;

import com.sliit.group66.smartcampus.dto.comment.CommentResponse;
import com.sliit.group66.smartcampus.dto.comment.CreateCommentRequest;
import com.sliit.group66.smartcampus.dto.comment.UpdateCommentRequest;
import com.sliit.group66.smartcampus.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/api/tickets/{ticketId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CreateCommentRequest request) {
        Long currentUserId = 1L; // temporary
        CommentResponse response = commentService.addComment(ticketId, request, currentUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/tickets/{ticketId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    @PutMapping("/api/comments/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody UpdateCommentRequest request) {
        Long currentUserId = 1L; // temporary
        return ResponseEntity.ok(commentService.updateComment(commentId, request, currentUserId));
    }

    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        Long currentUserId = 1L; // temporary
        commentService.deleteComment(commentId, currentUserId);
        return ResponseEntity.noContent().build();
    }
}