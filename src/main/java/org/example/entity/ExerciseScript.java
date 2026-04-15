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
    @Lob
    private String uploadScript;
    @Enumerated(EnumType.STRING)
    private ExerciseLevel level;

}
