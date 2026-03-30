package org.example.api;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.model.request.ReminderLogRequest;
import org.example.model.response.ReminderLogResponse;
import org.example.service.ReminderLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminder-logs")
@SecurityRequirement(name = "api")
public class ReminderLogAPI {

    @Autowired
    ReminderLogService service;


    @PostMapping
    @PreAuthorize("hasRole('ELDERLYUSER')")
    public ReminderLogResponse create(@RequestBody ReminderLogRequest request) {
        return service.create(request);
    }

    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ELDERLYUSER')")
    public ReminderLogResponse confirm(@PathVariable Long id) {
        return service.confirm(id);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public List<ReminderLogResponse> getAll() {
        return service.getAll();
    }


    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ReminderLogResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
