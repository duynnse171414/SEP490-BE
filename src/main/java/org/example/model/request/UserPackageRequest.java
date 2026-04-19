package org.example.model.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import org.example.entity.PaymentStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserPackageRequest {

    private Long accountId;
    private Long servicePackageId;
    private Long elderlyProfileId;
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;


}