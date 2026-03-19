package org.example.model.response;

import lombok.Data;

@Data
public class RobotResponse {

    private Long id;
    private String robotName;
    private String model;
    private String serialNumber;
    private String firmwareVersion;
    private String status;

    private Long assignedElderlyId;
    private String assignedElderlyName;
}
