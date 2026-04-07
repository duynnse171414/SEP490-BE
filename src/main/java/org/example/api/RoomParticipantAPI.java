package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.model.request.RoomParticipantRequest;
import org.example.model.response.RoomParticipantResponse;
import org.example.service.RoomParticipantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-participants")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
public class RoomParticipantAPI {

    private final RoomParticipantService service;

    @PostMapping
    public RoomParticipantResponse add(@RequestBody RoomParticipantRequest request) {
        return service.add(request);
    }

    @GetMapping("/room/{roomId}")
    public List<RoomParticipantResponse> getByRoom(@PathVariable Long roomId) {
        return service.getByRoom(roomId);
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) {
        service.remove(id);
    }
}