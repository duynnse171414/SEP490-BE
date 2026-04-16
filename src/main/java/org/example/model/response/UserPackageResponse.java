package org.example.model.response;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import org.example.entity.PaymentStatus;

import java.time.LocalDateTime;

@Data
public class UserPackageResponse {

    private Long id;
    private Long accountId;
    private Long servicePackageId;
    private Long elderlyProfileId;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private LocalDateTime assignedAt;
    private LocalDateTime expiredAt;
}