package org.example.model.request;

import lombok.Data;

@Data
public class VoiceCommandRequest {

    private Long interactionId;
    private String commandText;
    private String commandType;
}