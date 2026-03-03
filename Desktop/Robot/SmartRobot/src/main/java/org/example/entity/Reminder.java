package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "elderly_id")
    private ElderlyProfile elderly;

    @ManyToOne
    @JoinColumn(name = "caregiver_id")
    private CaregiverProfile caregiver;

    private String title;
    private String reminderType;
    private LocalDateTime scheduleTime;
    private String repeatPattern;

    private boolean active = true;
}
