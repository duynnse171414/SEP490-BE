package org.example.api;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.model.request.CaregiverProfileRequest;
import org.example.model.response.CaregiverProfileResponse;
import org.example.service.CaregiverProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@SecurityRequirement(name = "api")
@RestController
@RequestMapping("/api/caregiver-profiles")

public class CaregiverProfileAPI {
     @Autowired
     CaregiverProfileService service;

    @PostMapping
    public CaregiverProfileResponse create(@RequestBody CaregiverProfileRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<CaregiverProfileResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public CaregiverProfileResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public CaregiverProfileResponse update(@PathVariable Long id,
                                           @RequestBody CaregiverProfileRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}