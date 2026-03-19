package org.example.model.request;

import lombok.Data;

@Data
public class InteractionLogRequest {

    private Long elderlyId;
    private Long robotId;

    private String interactionType;
    private String userInputText;
    private String robotResponseText;
    private String emotionDetected;
}