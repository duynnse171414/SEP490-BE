package org.example.api;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.example.model.request.CaregiverProfileRequest;
import org.example.model.request.ElderlyProfileRequest;
import org.example.model.response.CaregiverProfileResponse;
import org.example.model.response.ElderlyProfileResponse;
import org.example.service.CaregiverProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/caregiver-profiles")
@SecurityRequirement(name = "api")
public class CaregiverProfileAPI {

    @Autowired
    CaregiverProfileService caregiverProfileService;


    @PostMapping("{accountId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public ResponseEntity create(@PathVariable Long accountId,
                                 @Valid @RequestBody CaregiverProfileRequest request) {

        return ResponseEntity.ok(caregiverProfileService.create(accountId, request));
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public List<CaregiverProfileResponse> getAll() {
        return caregiverProfileService.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER')")
    public CaregiverProfileResponse getById(@PathVariable Long id) {
        return caregiverProfileService.getById(id);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public CaregiverProfileResponse update(@PathVariable Long id,
                                           @RequestBody CaregiverProfileRequest request) {
        return caregiverProfileService.update(id, request);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public void delete(@PathVariable Long id) {
        caregiverProfileService.delete(id);
    }


    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<CaregiverProfileResponse>> getByAccount(
            @PathVariable Long accountId) {

        return ResponseEntity.ok(
                caregiverProfileService.getByAccount(accountId)
        );
    }
}