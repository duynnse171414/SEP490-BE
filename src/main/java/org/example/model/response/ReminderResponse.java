package org.example.model.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReminderResponse {

    private Long id;

    private Long elderlyId;
    private String elderlyName;

    private Long caregiverId;
    private String caregiverName;

    private String title;
    private String reminderType;
    private LocalDateTime scheduleTime;
    private String repeatPattern;

    private boolean active;
}
