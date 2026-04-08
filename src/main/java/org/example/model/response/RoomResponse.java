package org.example.model.response;


import lombok.Data;

import java.util.List;

@Data
public class RoomResponse {
    private Long id;
    private String roomName;

    private Long managerId;

    private List<CaregiverDTO> caregivers;
    private List<ElderlyDTO> elderlies;

    private RobotDTO robot;



}