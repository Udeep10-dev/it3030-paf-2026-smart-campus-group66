package com.sliit.group66.smartcampus.dto.ticket;

import com.sliit.group66.smartcampus.enums.TicketCategory;
import com.sliit.group66.smartcampus.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateTicketRequest {

    private Long resourceId;

    private String location;

    @NotNull
    private TicketCategory category;

    @NotBlank
    private String description;

    @NotNull
    private TicketPriority priority;

    private String preferredContact;

    public Long getResourceId() {
        return resourceId;
    }

    public String getLocation() {
        return location;
    }

    public TicketCategory getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public String getPreferredContact() {
        return preferredContact;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setCategory(TicketCategory category) {
        this.category = category;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public void setPreferredContact(String preferredContact) {
        this.preferredContact = preferredContact;
    }
}