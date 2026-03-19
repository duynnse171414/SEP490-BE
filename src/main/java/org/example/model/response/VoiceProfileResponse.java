package org.example.model.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VoiceProfileResponse {

    private Long id;
    private Long elderlyId;
    private String voicePrintHash;
    private int sampleCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}