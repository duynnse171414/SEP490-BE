package org.example.model.request;

import lombok.Data;

@Data
public class CaregiverProfileRequest {

    private Long accountId;
    private String relationship;
    private String name;
    private String notificationPreference;
}


