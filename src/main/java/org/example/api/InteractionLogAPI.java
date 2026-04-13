package org.example.api;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.model.request.InteractionLogRequest;
import org.example.model.response.InteractionLogResponse;
import org.example.service.InteractionLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interaction-logs")
@SecurityRequirement(name = "api")
public class InteractionLogAPI {

    @Autowired
    InteractionLogService service;


    @PostMapping
    @PreAuthorize("hasRole('ELDERLYUSER','CAREGIVER')")
    public InteractionLogResponse create(@RequestBody InteractionLogRequest request) {
        return service.create(request);
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER')")
    public List<InteractionLogResponse> getAll() {
        return service.getAll();
    }


    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public InteractionLogResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }


    @PatchMapping("/{id}/emotion")
    @PreAuthorize("hasAnyRole('ELDERLYUSER','CAREGIVER')")
    public InteractionLogResponse updateEmotion(@PathVariable Long id,
                                                @RequestParam String emotion) {
        return service.updateEmotion(id, emotion);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
