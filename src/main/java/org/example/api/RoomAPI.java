package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
@SecurityRequirement(name = "api")
public class RoomAPI {

    private final RoomService roomService;

    // CREATE
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    @PostMapping
    public RoomResponse create(@RequestBody RoomRequest request) {
        return roomService.create(request);
    }

    // GET
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    @GetMapping
    public List<RoomResponse> getAll() {
        return roomService.getAll();
    }

    @GetMapping("/{id}")
    public RoomResponse getById(@PathVariable Long id) {
        return roomService.getById(id);
    }

    @GetMapping("/{roomId}/elderlies")
    public List<ElderlyDTO> getElderliesByRoom(@PathVariable Long roomId) {
        return roomService.getElderliesByRoom(roomId);
    }

    // GET caregivers by room
    @GetMapping("/{roomId}/caregivers")
    public List<CaregiverDTO> getCaregiversByRoom(@PathVariable Long roomId) {
        return roomService.getCaregiversByRoom(roomId);
    }

    // UPDATE
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    @PutMapping("/{id}")
    public RoomResponse update(@PathVariable Long id,
                               @RequestBody RoomRequest request) {
        return roomService.update(id, request);
    }

    // DELETE
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        roomService.delete(id);
    }

    // ===== ASSIGN =====
    @PostMapping("/{roomId}/caregivers/{id}")
    public void addCaregiver(@PathVariable Long roomId, @PathVariable Long id) {
        roomService.addCaregiver(roomId, id);
    }

    @PostMapping("/{roomId}/elderlies/{id}")
    public void addElderly(@PathVariable Long roomId, @PathVariable Long id) {
        roomService.addElderly(roomId, id);
    }

    @PostMapping("/{roomId}/robot/{id}")
    public void assignRobot(@PathVariable Long roomId, @PathVariable Long id) {
        roomService.assignRobot(roomId, id);
    }

    // ===== REMOVE =====
    @DeleteMapping("/caregivers/{id}")
    public void removeCaregiver(@PathVariable Long id) {
        roomService.removeCaregiver(id);
    }

    @DeleteMapping("/elderlies/{id}")
    public void removeElderly(@PathVariable Long id) {
        roomService.removeElderly(id);
    }

    @DeleteMapping("/{roomId}/robot")
    public void removeRobot(@PathVariable Long roomId) {
        roomService.removeRobot(roomId);
    }
}
