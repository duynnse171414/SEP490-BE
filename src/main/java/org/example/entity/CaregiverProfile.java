package org.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class CaregiverProfile {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private boolean deleted = false;

        @Column(name = "name")
        private String name;

        @Column(name = "relationship")
        private String relationship;

        // 🔥 FIX CHỖ NÀY
        @Column(name = "notification_preference")
        private String notificationPreference;

        @ManyToOne
        @JoinColumn(name = "account_id")
        private Account account;

        @ManyToOne
        @JoinColumn(name = "room_id")
        private Room room;
    }

