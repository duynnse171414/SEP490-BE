package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.model.request.RoomRequest;
import org.example.model.response.RoomResponse;
import org.example.service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
public class RoomAPI {

    private final RoomService service;

    @PostMapping
    public RoomResponse create(@RequestBody RoomRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<RoomResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public RoomResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public RoomResponse update(@PathVariable Long id,
                               @RequestBody RoomRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}