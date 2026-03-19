package org.example.model.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExerciseSessionResponse {

    private Long id;

    private Long exerciseId;
    private String exerciseName;

    private Long elderlyId;
    private String elderlyName;

    private Long robotId;
    private String robotName;

    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String feedback;
}