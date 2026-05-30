package org.example.model.request;

import lombok.Data;
import org.example.entity.ReminderType;

import java.time.LocalDateTime;

@Data
public class ReminderRequest {

    private Long elderlyId;
    private String title;
    private ReminderType reminderType;
    private LocalDateTime scheduleTime;
    private String repeatPattern;

    private Boolean active;
}
