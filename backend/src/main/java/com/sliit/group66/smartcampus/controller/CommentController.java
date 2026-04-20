package com.sliit.group66.smartcampus.controller;

import com.sliit.group66.smartcampus.dto.comment.CommentResponse;
import com.sliit.group66.smartcampus.dto.comment.CreateCommentRequest;
import com.sliit.group66.smartcampus.dto.comment.UpdateCommentRequest;
import com.sliit.group66.smartcampus.entity.User;
import com.sliit.group66.smartcampus.security.AuthenticatedUserService;
import com.sliit.group66.smartcampus.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CommentController {

    private final CommentService commentService;
    private final AuthenticatedUserService authenticatedUserService;

    public CommentController(CommentService commentService,
                             AuthenticatedUserService authenticatedUserService) {
        this.commentService = commentService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @PostMapping("/api/tickets/{ticketId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        User currentUser = authenticatedUserService.getCurrentUser(authentication);
        CommentResponse response = commentService.addComment(ticketId, request, currentUser.getId(), currentUser.getRole());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/tickets/{ticketId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long ticketId,
                                                             Authentication authentication) {
        User currentUser = authenticatedUserService.getCurrentUser(authentication);
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId, currentUser.getId(), currentUser.getRole()));
    }

    @PutMapping("/api/comments/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody UpdateCommentRequest request,
            Authentication authentication) {
        User currentUser = authenticatedUserService.getCurrentUser(authentication);
        return ResponseEntity.ok(commentService.updateComment(commentId, request, currentUser.getId()));
    }

    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId,
                                              Authentication authentication) {
        User currentUser = authenticatedUserService.getCurrentUser(authentication);
        commentService.deleteComment(commentId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
