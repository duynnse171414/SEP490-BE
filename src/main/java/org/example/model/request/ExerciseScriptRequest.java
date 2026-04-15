package org.example.model.request;


import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Lob;
import lombok.Data;
import org.example.entity.ExerciseLevel;

@Data
public class ExerciseScriptRequest {

    private String name;
    private String description;
    private Integer durationMinutes;
    @Lob
    private String uploadScript;
    @Enumerated(EnumType.STRING)
    private ExerciseLevel level;
}