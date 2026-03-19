package org.example.model.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExerciseSessionRequest {

    private Long exerciseId;
    private Long elderlyId;
    private Long robotId;

    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String feedback;
}