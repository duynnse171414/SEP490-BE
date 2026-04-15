package org.example.model.response;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Lob;
import lombok.Data;
import org.example.entity.ExerciseLevel;

@Data
public class ExerciseScriptResponse {

    private Long id;
    private String name;
    private String description;
    private Integer durationMinutes;
    @Enumerated(EnumType.STRING)
    private ExerciseLevel level;
}