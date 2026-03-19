package org.example.model.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ElderlyProfileResponse {

    private Long id;
    private Long accountId;
    private LocalDate dateOfBirth;
    private String healthNotes;
    private String preferredLanguage;
    private String speakingSpeed;
    private boolean deleted;
}