package org.example.model.response;

import lombok.Data;

@Data
public class ExerciseScriptResponse {

    private Long id;
    private String name;
    private String description;
    private Integer durationMinutes;
    private String difficultyLevel;
}