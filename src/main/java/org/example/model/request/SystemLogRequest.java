package org.example.model.request;

import lombok.Data;

@Data
public class SystemLogRequest {

    private Long accountId;
    private String action;
    private String targetEntity;
}