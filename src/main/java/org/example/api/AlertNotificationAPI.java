package org.example.api;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.model.request.AlertNotificationRequest;
import org.example.model.response.AlertNotificationResponse;
import org.example.service.AlertNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@SecurityRequirement(name = "api")
public class AlertNotificationAPI {

    @Autowired
    AlertNotificationService service;


    @PostMapping
    @PreAuthorize("hasAnyRole('ELDERLYUSER','ADMINISTRATOR')")
    public AlertNotificationResponse create(@RequestBody AlertNotificationRequest request) {
        return service.create(request);
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER')")
    public List<AlertNotificationResponse> getAll() {
        return service.getAll();
    }


    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public AlertNotificationResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CAREGIVER','FAMILYMEMBER','MANAGER')")
    public AlertNotificationResponse update(@PathVariable Long id,
                                            @RequestBody AlertNotificationRequest request) {
        return service.update(id, request);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
