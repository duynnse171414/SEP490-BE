package org.example.model.response;

import lombok.Data;
import java.util.List;

@Data
public class ServicePackageResponse {

    private Long id;
    private String name;
    private String description;
    private String level;
    private double price;
    private boolean active;
    private Integer durationDays;
    private List<RobotActionResponse> robotActions;
}