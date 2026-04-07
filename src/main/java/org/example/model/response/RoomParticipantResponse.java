package org.example.model.response;

import lombok.Data;

@Data
public class RoomParticipantResponse {

    private Long id;
    private Long roomId;
    private Long accountId;
}