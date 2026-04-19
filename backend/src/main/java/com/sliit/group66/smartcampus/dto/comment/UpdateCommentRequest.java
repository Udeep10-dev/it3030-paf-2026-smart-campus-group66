package com.sliit.group66.smartcampus.dto.comment;

import jakarta.validation.constraints.NotBlank;

public class UpdateCommentRequest {

    @NotBlank
    private String commentText;

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }
}