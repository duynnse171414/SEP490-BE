package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class InteractionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private ElderlyProfile elderly;

    @ManyToOne
    private Robot robot;

    private String interactionType;
    private String userInputText;
    private String robotResponseText;
    private String emotionDetected;
    boolean deleted = false;
    private LocalDateTime createdAt;
}