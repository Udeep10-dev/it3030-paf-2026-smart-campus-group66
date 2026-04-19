package com.sliit.group66.smartcampus.service;

import com.sliit.group66.smartcampus.entity.Notification;
import com.sliit.group66.smartcampus.enums.NotificationType;
import java.util.List;

public interface NotificationService {
    Notification createNotification(Long userId, String message, NotificationType type);
    List<Notification> getUserNotifications(Long userId);
    Notification markAsRead(Long notificationId);
    List<Notification> getAllNotifications();
}
