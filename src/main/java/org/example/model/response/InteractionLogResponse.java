package org.example.model.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InteractionLogResponse {

    private Long id;

    private Long elderlyId;
    private String elderlyName;

    private Long robotId;
    private String robotName;

    private String interactionType;
    private String userInputText;
    private String robotResponseText;
    private String emotionDetected;

    private LocalDateTime createdAt;
}