package org.example.model.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReminderLogResponse {

    private Long id;

    private Long reminderId;
    private String reminderTitle;

    private Long robotId;
    private String robotName;

    private Long elderlyId;
    private String elderlyName;

    private LocalDateTime triggeredTime;
    private boolean confirmed;
    private LocalDateTime confirmedTime;
}
