package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.exception.BadRequestException;
import org.example.exception.NotFoundException;
import org.example.model.request.RoomRequest;
import org.example.model.response.*;
import org.example.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomService {

    private final RoomRepository roomRepository;
    private final AccountRepository accountRepository;
    private final CaregiverProfileRepository caregiverRepository;
    private final ElderlyProfileRepository elderlyRepository;
    private final RobotRepository robotRepository;

    // ================= CREATE =================
    public RoomResponse create(RoomRequest request) {

        Account manager = accountRepository.findById(request.getManagerId())
                .orElseThrow(() -> new NotFoundException("Manager not found"));

        validateManager(manager);

        Room room = new Room();
        room.setRoomName(request.getRoomName());
        room.setManager(manager);

        roomRepository.save(room);

        return mapToResponse(room);
    }

    // ================= GET =================
    @Transactional(readOnly = true)
    public List<RoomResponse> getAll() {
        return roomRepository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public RoomResponse getById(Long id) {
        return mapToResponse(getRoom(id));
    }

    // ================= UPDATE =================
    public RoomResponse update(Long id, RoomRequest request) {

        Room room = getRoom(id);

        room.setRoomName(request.getRoomName());

        return mapToResponse(room);
    }

    // ================= DELETE =================
    public void delete(Long id) {

        Room room = getRoom(id);

        validateRoomEmpty(room);

        room.setDeleted(true);
    }

    // ================= ASSIGN =================
    public void addCaregiver(Long roomId, Long caregiverId) {

        Room room = getRoom(roomId);
        CaregiverProfile caregiver = caregiverRepository.findById(caregiverId)
                .orElseThrow(() -> new NotFoundException("Caregiver not found"));

        if (caregiver.getRoom() != null) {
            throw new BadRequestException("Caregiver already assigned");
        }

        caregiver.setRoom(room);
    }

    public void addElderly(Long roomId, Long elderlyId) {

        Room room = getRoom(roomId);
        ElderlyProfile elderly = elderlyRepository.findById(elderlyId)
                .orElseThrow(() -> new NotFoundException("Elderly not found"));

        if (elderly.getRoom() != null) {
            throw new BadRequestException("Elderly already assigned");
        }

        elderly.setRoom(room);
    }

    public void assignRobot(Long roomId, Long robotId) {

        Room room = getRoom(roomId);
        Robot robot = robotRepository.findById(robotId)
                .orElseThrow(() -> new NotFoundException("Robot not found"));

        if (room.getRobot() != null) {
            throw new BadRequestException("Room already has robot");
        }

        if (robot.getRoom() != null) {
            throw new BadRequestException("Robot already assigned");
        }

        robot.setRoom(room);
        room.setRobot(robot);
    }

    // ================= REMOVE =================
    public void removeCaregiver(Long caregiverId) {

        CaregiverProfile caregiver = caregiverRepository.findById(caregiverId)
                .orElseThrow(() -> new NotFoundException("Caregiver not found"));

        caregiver.setRoom(null);
    }

    public void removeElderly(Long elderlyId) {

        ElderlyProfile elderly = elderlyRepository.findById(elderlyId)
                .orElseThrow(() -> new NotFoundException("Elderly not found"));

        elderly.setRoom(null);
    }

    public void removeRobot(Long roomId) {

        Room room = getRoom(roomId);

        if (room.getRobot() == null) {
            throw new BadRequestException("Room has no robot");
        }

        Robot robot = room.getRobot();

        robot.setRoom(null);
        room.setRobot(null);
    }

    // ================= HELPERS =================
    private Room getRoom(Long id) {
        return roomRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new NotFoundException("Room not found"));
    }

    private void validateManager(Account manager) {
        if (!manager.getRole().equals(Role.MANAGER)) {
            throw new BadRequestException("Account is not manager");
        }
    }

    private void validateRoomEmpty(Room room) {
        if (!room.getCaregiverProfiles().isEmpty()
                || !room.getElderlyProfiles().isEmpty()
                || room.getRobot() != null) {

            throw new BadRequestException("Room is not empty");
        }
    }

    // ================= MAPPER =================
    private RoomResponse mapToResponse(Room room) {

        return RoomResponse.builder()
                .id(room.getId())
                .roomName(room.getRoomName())
                .managerId(room.getManager() != null ? room.getManager().getId() : null)
                .caregivers(
                        room.getCaregiverProfiles().stream()
                                .map(c -> new CaregiverDTO(c.getId(), c.getName()))
                                .toList()
                )
                .elderlies(
                        room.getElderlyProfiles().stream()
                                .map(e -> new ElderlyDTO(e.getId(), e.getName()))
                                .toList()
                )
                .robot(
                        room.getRobot() != null
                                ? new RobotDTO(room.getRobot().getId(), room.getRobot().getRobotName())
                                : null
                )
                .build();
    }
}