package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.entity.Room;
import org.example.model.request.RoomRequest;
import org.example.model.response.CaregiverDTO;
import org.example.model.response.ElderlyDTO;
import org.example.model.response.RoomResponse;
import org.example.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@SecurityRequirement(name = "api")
public class RoomAPI {

    @Autowired
     RoomService roomService;
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER'")
    @PostMapping
    public ResponseEntity<RoomResponse> create(@RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.create(request));
    }
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER'")
    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAll() {
        return ResponseEntity.ok(roomService.getAll());
    }
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER'")
    @GetMapping("/{id}")
    public ResponseEntity<RoomResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getById(id));
    }
    @PreAuthorize("hasAnyRole('ADMINISTRATOR'")
    @PutMapping("/{id}")
    public ResponseEntity<RoomResponse> update(@PathVariable Long id,
                                               @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.update(id, request));
    }
    @PreAuthorize("hasAnyRole('ADMINISTRATOR'")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        roomService.delete(id);
        return ResponseEntity.ok("Deleted");
    }
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER'")
    @PostMapping("/{roomId}/caregivers/{caregiverId}")
    public ResponseEntity<?> addCaregiverToRoom(
            @PathVariable Long roomId,
            @PathVariable Long caregiverId) {

        roomService.addCaregiverToRoom(roomId, caregiverId);
        return ResponseEntity.ok("Caregiver added to room");
    }
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER'")
    @PostMapping("/{roomId}/robots/{robotId}")
    public ResponseEntity<?> assignRobotToRoom(
            @PathVariable Long roomId,
            @PathVariable Long robotId) {

        roomService.assignRobotToRoom(roomId, robotId);
        return ResponseEntity.ok("Robot assigned to room");
    }
    @PreAuthorize("hasAnyRole('CAREGIVER'")
    @PostMapping("/{roomId}/elderly/{elderlyId}")
    public ResponseEntity<?> addElderlyToRoom(
            @PathVariable Long roomId,
            @PathVariable Long elderlyId) {

        roomService.addElderlyToRoom(roomId, elderlyId);
        return ResponseEntity.ok("Elderly added to room");
    }

    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER'")
    @GetMapping("/{roomId}/caregivers")
    public ResponseEntity<List<CaregiverDTO>> getCaregivers(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomService.getCaregiversByRoom(roomId));
    }
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER'")
    @GetMapping("/{roomId}/elderlies")
    public ResponseEntity<List<ElderlyDTO>> getElderlies(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomService.getElderliesByRoom(roomId));
    }
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER'")
    @GetMapping("/{roomId}/robot")
    public ResponseEntity<?> getRobot(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomService.getRobotByRoom(roomId));
    }
}