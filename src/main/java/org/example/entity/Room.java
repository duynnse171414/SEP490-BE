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

    // 🔥 Caregiver nhiều phòng
    @ManyToMany
    @JoinTable(
            name = "room_caregiver",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "caregiver_id")
    )
    private List<CaregiverProfile> caregiverProfiles;

    // 🔥 1 room - nhiều elderly
    @OneToMany(mappedBy = "room")
    private List<ElderlyProfile> elderlyProfiles;

    @OneToOne(mappedBy = "room")
    private Robot robot;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Account manager;
}