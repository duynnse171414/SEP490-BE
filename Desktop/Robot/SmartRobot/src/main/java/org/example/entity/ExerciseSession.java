package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class ExerciseSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private ExerciseScript exercise;

    @ManyToOne
    private ElderlyProfile elderly;

    @ManyToOne
    private Robot robot;

    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String feedback;
}
