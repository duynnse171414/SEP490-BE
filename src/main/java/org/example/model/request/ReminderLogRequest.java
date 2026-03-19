package org.example.model.request;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReminderLogRequest {

    private Long reminderId;
    private Long robotId;
    private Long elderlyId;

    private LocalDateTime triggeredTime;
}
