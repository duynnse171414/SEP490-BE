package org.example.api;


import lombok.RequiredArgsConstructor;
import org.example.model.request.InteractionLogRequest;
import org.example.model.response.InteractionLogResponse;
import org.example.service.InteractionLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interaction-logs")
@RequiredArgsConstructor
public class InteractionLogAPI {
    @Autowired
    InteractionLogService service;

    @PostMapping
    public InteractionLogResponse create(@RequestBody InteractionLogRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<InteractionLogResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public InteractionLogResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PatchMapping("/{id}/emotion")
    public InteractionLogResponse updateEmotion(@PathVariable Long id,
                                                @RequestParam String emotion) {
        return service.updateEmotion(id, emotion);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}