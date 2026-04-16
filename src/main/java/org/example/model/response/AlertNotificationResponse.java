package org.example.model.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AlertNotificationResponse {

    private Long id;

    private Long elderlyId;
    private String elderlyName;
    private Long reminderLogId;
    private String alertType;
    private String message;
    private boolean resolved;
    private LocalDateTime createdAt;
}