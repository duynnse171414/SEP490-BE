package org.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "system_log")
public class SystemLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // USER đã đổi thành Account
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    private String action;

    private String targetEntity;

    private LocalDateTime createdAt;
}
