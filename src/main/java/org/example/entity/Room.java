package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "room")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomName;

    private boolean deleted = false;


    @OneToMany(mappedBy = "room")
    private List<CaregiverProfile> caregiverProfiles;


    @OneToMany(mappedBy = "room")
    private List<ElderlyProfile> elderlyProfiles;

    @OneToOne(mappedBy = "room")
    private Robot robot;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Account manager;
}
