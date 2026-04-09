package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.model.request.ReminderRequest;
import org.example.model.response.ElderlyProfileResponse;
import org.example.model.response.ReminderResponse;
import org.example.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@SecurityRequirement(name = "api")
public class ReminderAPI {

    @Autowired
    ReminderService service;


    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CAREGIVER','FAMILYMEMBER')")
    public ReminderResponse create(@RequestBody ReminderRequest request) {
        return service.create(request);
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CAREGIVER')")
    public List<ReminderResponse> getAll() {
        return service.getAll();
    }


    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ReminderResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CAREGIVER','FAMILYMEMBER')")
    public ReminderResponse update(@PathVariable Long id,
                                   @RequestBody ReminderRequest request) {
        return service.update(id, request);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // GET by caregiver
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    @GetMapping("/caregiver/{caregiverId}")
    public List<ReminderResponse> getByCaregiver(@PathVariable Long caregiverId) {
        return service.getByCaregiverId(caregiverId);
    }

    // GET by elderly
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER')")
    @GetMapping("/elderly/{elderlyId}")
    public List<ReminderResponse> getByElderly(@PathVariable Long elderlyId) {
        return service.getByElderlyId(elderlyId);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<ReminderResponse>> getByAccount(
            @PathVariable Long accountId) {

        return ResponseEntity.ok(
                service.getByAccount(accountId)
        );
    }
}
