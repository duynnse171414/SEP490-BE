package org.example.model.request;

import lombok.Data;

@Data
public class ServicePackageRequest {

    private String name;
    private String description;
    private String level;
    private double price;
    private boolean active;
}