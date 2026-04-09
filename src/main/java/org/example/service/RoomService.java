package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.exception.NotFoundException;
import org.example.model.request.RoomRequest;
import org.example.model.response.*;
import org.example.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final AccountRepository accountRepository;
    private final CaregiverProfileRepository caregiverProfileRepository;
    private final ElderlyProfileRepository elderlyProfileRepository;
    private final RobotRepository robotRepository;

    // CREATE
    public RoomResponse create(RoomRequest request) {

        Room room = new Room();
        room.setRoomName(request.getRoomName());
        if (request.getManagerId() != null) {
            Account manager = accountRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new NotFoundException("Manager not found"));

            room.setManager(manager);
        }

        roomRepository.save(room);

        return mapToResponse(room);
    }




    // GET ALL
    public List<RoomResponse> getAll() {
        return roomRepository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // GET BY ID
    public RoomResponse getById(Long id) {

        Room room = roomRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new NotFoundException("Room not found"));

        return mapToResponse(room);
    }

    // UPDATE (chỉ update name)
    public RoomResponse update(Long id, RoomRequest request) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Room not found"));

        room.setRoomName(request.getRoomName());

        return mapToResponse(roomRepository.save(room));
    }

    // DELETE
    public void delete(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Room not found"));

        room.setDeleted(true);
        roomRepository.save(room);
    }

    // ADD CAREGIVER
    public void addCaregiverToRoom(Long roomId, Long caregiverId) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new NotFoundException("Room not found"));

        CaregiverProfile caregiver = caregiverProfileRepository.findById(caregiverId)
                .orElseThrow(() -> new NotFoundException("Caregiver not found"));

        if (room.getCaregiverProfiles() == null) {
            room.setCaregiverProfiles(new ArrayList<>());
        }

        if (!room.getCaregiverProfiles().contains(caregiver)) {
            room.getCaregiverProfiles().add(caregiver);
        }

        roomRepository.save(room);
    }

    // ADD ELDERLY
    public void addElderlyToRoom(Long roomId, Long elderlyId) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new NotFoundException("Room not found"));

        ElderlyProfile elderly = elderlyProfileRepository.findById(elderlyId)
                .orElseThrow(() -> new NotFoundException("Elderly not found"));

        if (elderly.getRoom() != null) {
            throw new RuntimeException("Elderly already in another room");
        }

        elderly.setRoom(room);
        elderlyProfileRepository.save(elderly);
    }


    public void assignRobotToRoom(Long roomId, Long robotId) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new NotFoundException("Room not found"));

        Robot robot = robotRepository.findById(robotId)
                .orElseThrow(() -> new NotFoundException("Robot not found"));

        // ❗ check room đã có robot chưa
        if (room.getRobot() != null) {
            throw new RuntimeException("Room already has a robot");
        }

        // ❗ check robot đã thuộc room khác chưa
        if (robot.getRoom() != null) {
            throw new RuntimeException("Robot already assigned to another room");
        }

        robot.setRoom(room);
        room.setRobot(robot);

        robotRepository.save(robot);
    }

    // MAP RESPONSE
    private RoomResponse mapToResponse(Room room) {

        RoomResponse res = new RoomResponse();

        res.setId(room.getId());
        res.setRoomName(room.getRoomName());

        if (room.getManager() != null) {
            res.setManagerId(room.getManager().getId());
        }

        // caregivers
        if (room.getCaregiverProfiles() != null) {
            res.setCaregivers(
                    room.getCaregiverProfiles().stream().map(c -> {
                        CaregiverDTO dto = new CaregiverDTO();
                        dto.setId(c.getId());
                        dto.setName(c.getName());
                        return dto;
                    }).toList()
            );
        }

        // elderly
        if (room.getElderlyProfiles() != null) {
            res.setElderlies(
                    room.getElderlyProfiles().stream().map(e -> {
                        ElderlyDTO dto = new ElderlyDTO();
                        dto.setId(e.getId());
                        dto.setName(e.getName());
                        return dto;
                    }).toList()
            );
        }

        // 🔥 robot (1 cái thôi)
        if (room.getRobot() != null) {

            Robot r = room.getRobot();

            RobotDTO dto = new RobotDTO();
            dto.setId(r.getId());
            dto.setRobotName(r.getRobotName());


            res.setRobot(dto);
        }

        return res;
    }

    public List<CaregiverDTO> getCaregiversByRoom(Long roomId) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new NotFoundException("Room not found"));

        if (room.getCaregiverProfiles() == null) {
            return new ArrayList<>();
        }

        return room.getCaregiverProfiles().stream().map(c -> {
            CaregiverDTO dto = new CaregiverDTO();
            dto.setId(c.getId());
            dto.setName(c.getName());
            return dto;
        }).toList();
    }

    public List<ElderlyDTO> getElderliesByRoom(Long roomId) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new NotFoundException("Room not found"));

        if (room.getElderlyProfiles() == null) {
            return new ArrayList<>();
        }

        return room.getElderlyProfiles().stream().map(e -> {
            ElderlyDTO dto = new ElderlyDTO();
            dto.setId(e.getId());
            dto.setName(e.getName());
            return dto;
        }).toList();
    }
    public RobotDTO getRobotByRoom(Long roomId) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new NotFoundException("Room not found"));

        if (room.getRobot() == null) {
            return null;
        }

        Robot r = room.getRobot();

        RobotDTO dto = new RobotDTO();
        dto.setId(r.getId());
        dto.setRobotName(r.getRobotName());

        return dto;
    }
}
