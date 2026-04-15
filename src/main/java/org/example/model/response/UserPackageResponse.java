package org.example.model.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserPackageResponse {

    private Long id;
    private Long accountId;
    private Long servicePackageId;
    private Long elderlyProfileId;

    private LocalDateTime assignedAt;
    private LocalDateTime expiredAt;
}