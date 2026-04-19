package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class ServicePackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String level;
    private double price;
    boolean deleted = false;
    private boolean active = true;
    private Integer durationDays;



    @ManyToMany
    @JoinTable(
            name = "servicepackage_robot_action",
            joinColumns = @JoinColumn(name = "service_package_id"),
            inverseJoinColumns = @JoinColumn(name = "robot_actionlibrary_id")
    )
    private List<RobotActionLibrary> robotActions;
}
