package org.example.model.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class QuotaResponse {
    private Long elderlyId;
    private long used;
    private int limit;
    private long remaining;
    private boolean unlimited;
    private boolean upgradeRequired;

    private boolean hasActivePackage;
    private String level;
    private String packageName;
    private LocalDateTime expiredAt;
}