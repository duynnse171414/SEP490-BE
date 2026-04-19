package org.example.model.request;

import lombok.Data;

import java.util.List;

@Data
public class ServicePackageRequest {

    private String name;
    private String description;
    private String level;
    private double price;
    private boolean active;
    private Integer durationDays;
    private List<Long> robotActionIds;
}