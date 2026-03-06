package org.example.model.request;

import lombok.Data;

@Data
public class AlertNotificationRequest {

    private Long elderlyId;
    private String alertType;
    private String message;
    private Boolean resolved;
}