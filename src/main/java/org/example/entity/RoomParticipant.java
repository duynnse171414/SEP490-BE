package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "room_participant")
public class RoomParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Room
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    // Account chung (dùng account thay vì profile cho gọn)
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    // Role trong room
    private String role; // ELDERLY, CAREGIVER, ROBOT

    private boolean deleted = false;
}
