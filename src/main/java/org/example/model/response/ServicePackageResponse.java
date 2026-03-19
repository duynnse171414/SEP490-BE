package org.example.model.response;

import lombok.Data;

@Data
public class ServicePackageResponse {

    private Long id;
    private String name;
    private String description;
    private String level;
    private double price;
    private boolean active;
}