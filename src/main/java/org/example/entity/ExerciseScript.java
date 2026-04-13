package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class ExerciseScript {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    boolean deleted = false;
    private String name;
    private String description;
    private int durationMinutes;
    private String difficultyLevel;
    @Column(columnDefinition = "TEXT")
    private String uploadScript;


}
