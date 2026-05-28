package org.example.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RobotActionLibrary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String code;
    private String type;
    private String description;

    private Integer duration;
    @ManyToMany(mappedBy = "robotActions")
    @JsonIgnore
    private List<ServicePackage> servicePackages;
}