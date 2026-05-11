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
import java.util.Map;

@RestController
@RequestMapping("/api/reminders")
@SecurityRequirement(name = "api")
public class ReminderAPI {

    @Autowired
    ReminderService service;


    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER','FAMILYMEMBER')")
    public ReminderResponse create(@RequestBody ReminderRequest request) {
        return service.create(request);
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CAREGIVER','FAMILYMEMBER')")
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

    // GET by caregiver
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER')")
    @GetMapping("/caregiver/{caregiverId}")
    public List<ReminderResponse> getByCaregiver(@PathVariable Long caregiverId) {
        return service.getByCaregiverId(caregiverId);
    }

    // GET by elderly
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER','FAMILYMEMBER')")
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

    // ReminderAPI
    @GetMapping("/quota/elderly/{elderlyId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER','FAMILYMEMBER')")
    public Map<String, Object> getQuotaByElderly(@PathVariable Long elderlyId) {
        return service.getQuotaByElderly(elderlyId);
    }


    // Bật/tắt reminder
    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER','FAMILYMEMBER')")
    public ReminderResponse toggleActive(@PathVariable Long id) {
        return service.toggleActive(id);
    }

    // Xóa mềm
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER','FAMILYMEMBER')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // Thùng rác
    @GetMapping("/trash")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER','FAMILYMEMBER')")
    public List<ReminderResponse> getDeleted() {
        return service.getDeletedReminders();
    }

    // Khôi phục
    @PostMapping("/{id}/restore")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER','FAMILYMEMBER')")
    public ReminderResponse restore(@PathVariable Long id) {
        return service.restore(id);
    }
}
