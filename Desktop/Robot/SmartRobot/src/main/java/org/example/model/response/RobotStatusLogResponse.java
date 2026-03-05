package org.example.model.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RobotStatusLogResponse {

    private Long id;

    private Long robotId;
    private String robotName;

    private String status;
    private LocalDateTime reportedAt;
}