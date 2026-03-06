package org.example.model.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SystemLogResponse {

    private Long id;
    private Long accountId;
    private String action;
    private String targetEntity;
    private LocalDateTime createdAt;
}