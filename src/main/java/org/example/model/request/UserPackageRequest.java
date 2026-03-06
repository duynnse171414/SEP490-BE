package org.example.model.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserPackageRequest {

    private Long accountId;
    private Long servicePackageId;

    private LocalDateTime assignedAt;
    private LocalDateTime expiredAt;
}