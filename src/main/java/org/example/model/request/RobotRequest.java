package org.example.model.request;

import lombok.Data;

@Data
public class RobotRequest {

    private String robotName;
    private String model;
    private String serialNumber;
    private String firmwareVersion;
    private String status;
    private Long assignedElderlyId;
}
