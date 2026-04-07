package org.example.model.request;


import lombok.Data;

@Data
public class ExerciseScriptRequest {

    private String name;
    private String description;
    private Integer durationMinutes;
    private String difficultyLevel;
    private String uploadScript;
}