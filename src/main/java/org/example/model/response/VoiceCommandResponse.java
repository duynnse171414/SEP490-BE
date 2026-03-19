package org.example.model.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VoiceCommandResponse {

    private Long id;
    private Long interactionId;
    private String commandText;
    private String commandType;
    private LocalDateTime createdAt;
}