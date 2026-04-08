package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Robot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String robotName;
    private String model;
    private String serialNumber;
    private String firmwareVersion;
    private String status;
    boolean deleted = false;

    @ManyToOne
    @JoinColumn(name = "assigned_elderly_id")
    private ElderlyProfile assignedElderly;
    @OneToOne
    @JoinColumn(name = "room_id", unique = true)
    private Room room;
}