package org.example.model.response;

import lombok.Data;

@Data
public class CaregiverProfileResponse {

    private Long id;
    private Long accountId;
    private String accountEmail;
    private String name;
    private String relationship;
    private String notificationPreference;
    private Long roomId;
}
