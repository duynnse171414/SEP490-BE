package org.example.model.request;

import lombok.Data;

@Data
public class RoomParticipantRequest {

    private Long roomId;
    private Long accountId;
}