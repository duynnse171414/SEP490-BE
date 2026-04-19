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

    private String name;        // "Hít đất"
    private String code;        // "012"
    private String type;        // ACTION / DANCE
    private String description;

    private Integer duration;   // seconds (optional)
    @ManyToMany(mappedBy = "robotActions")
    @JsonIgnore
    private List<ServicePackage> servicePackages;
}