package org.example.model.request;


import lombok.Data;
import org.example.model.response.RobotDTO;

import java.util.List;

@Data
public class RoomRequest {

    private  Long roomId;
    private String roomName;
    private Long managerId;


}
