package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.awt.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class ReminderLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reminder_id")
    private Reminder reminder;

    @ManyToOne
    @JoinColumn(name = "robot_id")
    private Robot robot;

    @ManyToOne
    @JoinColumn(name = "elderly_id")
    private ElderlyProfile elderly;
    boolean deleted = false;
    private LocalDateTime triggeredTime;
    private boolean confirmed;
    private LocalDateTime confirmedTime;
}
