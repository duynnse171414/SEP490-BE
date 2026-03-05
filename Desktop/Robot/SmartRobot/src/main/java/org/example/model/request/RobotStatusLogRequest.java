package org.example.model.request;

import lombok.Data;

@Data
public class RobotStatusLogRequest {

    private Long robotId;
    private String status;
}