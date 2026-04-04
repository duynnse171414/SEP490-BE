package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "elderly_profile")
public class ElderlyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "account_id")
    private Account account;
    private String name;
    private LocalDate dateOfBirth;
    private String healthNotes;
    private String preferredLanguage;
    private String speakingSpeed;
    private boolean deleted = false;
}