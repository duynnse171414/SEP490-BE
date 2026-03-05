package org.example.model.request;

import lombok.Data;

@Data
public class VoiceProfileRequest {

    private Long elderlyId;
    private String voicePrintHash;
    private int sampleCount;
}