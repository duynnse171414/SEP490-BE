package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class VoiceProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private ElderlyProfile elderly;

    private String voicePrintHash;
    private int sampleCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}