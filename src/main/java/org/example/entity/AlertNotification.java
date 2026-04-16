package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class AlertNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private ElderlyProfile elderly;

    @OneToOne
    @JoinColumn(name = "reminderlog_id")
    private ReminderLog reminderLog;

    private String alertType;
    private String message;
    private boolean resolved;
    boolean deleted = false;
    private LocalDateTime createdAt;
}
