package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class UserPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Account account;

    @ManyToOne
    private ServicePackage servicePackage;

    @ManyToOne
    @JoinColumn(name = "elderly_profile_id")
    private ElderlyProfile elderlyProfile;

    private LocalDateTime assignedAt;
    private LocalDateTime expiredAt;
    boolean deleted = false;

}