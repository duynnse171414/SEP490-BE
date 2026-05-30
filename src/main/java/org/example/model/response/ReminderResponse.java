package org.example.model.response;

import lombok.Data;
import org.example.entity.ReminderType;

import java.time.LocalDateTime;

@Data
public class ReminderResponse {

    private Long id;

    private Long elderlyId;
    private String elderlyName;
    private Long accountId;
    // private Long caregiverId;
    private String caregiverName;

    private String title;
    private ReminderType reminderType;
    private LocalDateTime scheduleTime;
    private String repeatPattern;

    private boolean active;
}
