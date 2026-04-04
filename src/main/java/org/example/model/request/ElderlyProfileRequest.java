package org.example.model.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ElderlyProfileRequest {

    private LocalDate dateOfBirth;
    private String healthNotes;
    private String name;
    private String preferredLanguage;
    private String speakingSpeed;
}