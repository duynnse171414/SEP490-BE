package org.example.api;

import org.example.model.response.ElderlyProfileResponse;
import org.example.model.request.ElderlyProfileRequest;
import org.example.service.ElderlyProfileService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/elderly-profile")
@SecurityRequirement(name = "api")
public class ElderlyProfileAPI {

    @Autowired
    ElderlyProfileService elderlyProfileService;


    @PostMapping("{accountId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','FAMILYMEMBER')")
    public ResponseEntity create(@PathVariable Long accountId,
                                 @Valid @RequestBody ElderlyProfileRequest request) {

        return ResponseEntity.ok(elderlyProfileService.create(accountId, request));
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public ResponseEntity<List<ElderlyProfileResponse>> getAll() {
        return ResponseEntity.ok(elderlyProfileService.getAll());
    }


    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER','FAMILYMEMBER')")
    public ResponseEntity getById(@PathVariable Long id) {
        return ResponseEntity.ok(elderlyProfileService.getById(id));
    }


    @PutMapping("{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public ResponseEntity update(@PathVariable Long id,
                                 @Valid @RequestBody ElderlyProfileRequest request) {

        return ResponseEntity.ok(elderlyProfileService.update(id, request));
    }


    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity delete(@PathVariable Long id) {
        elderlyProfileService.delete(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}