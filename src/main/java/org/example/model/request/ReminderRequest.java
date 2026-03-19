package org.example.model.request;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReminderRequest {

    private Long elderlyId;
    private Long caregiverId;

    private String title;
    private String reminderType;
    private LocalDateTime scheduleTime;
    private String repeatPattern;

    private Boolean active;
}
