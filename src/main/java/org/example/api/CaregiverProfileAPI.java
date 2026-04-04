package org.example.api;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.model.request.CaregiverProfileRequest;
import org.example.model.response.CaregiverProfileResponse;
import org.example.service.CaregiverProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/caregiver-profiles")
@SecurityRequirement(name = "api")
public class CaregiverProfileAPI {

    @Autowired
    CaregiverProfileService service;


//    @PostMapping
//    @PreAuthorize("hasAnyRole('ADMINISTRATOR')")
//    public CaregiverProfileResponse create(@RequestBody CaregiverProfileRequest request) {
//        return service.create(request);
//    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER')")
    public List<CaregiverProfileResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER')")
    public CaregiverProfileResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public CaregiverProfileResponse update(@PathVariable Long id,
                                           @RequestBody CaregiverProfileRequest request) {
        return service.update(id, request);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}