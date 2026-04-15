package org.example.model.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RoomResponse {
    private Long id;
    private String roomName;

    private Long managerId;

    private List<CaregiverDTO> caregivers;
    private List<ElderlyDTO> elderlies;

    private RobotDTO robot;



}