package org.example.api;

import org.example.model.reponse.ElderlyProfileResponse;
import org.example.model.request.ElderlyProfileRequest;
import org.example.service.ElderlyProfileService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SecurityRequirement(name = "api")
@RestController
@RequestMapping("api/elderly-profile")
public class ElderlyProfileAPI {

    @Autowired
    ElderlyProfileService elderlyProfileService;

    @PostMapping("{accountId}")
    public ResponseEntity create(@PathVariable Long accountId,
                                 @Valid @RequestBody ElderlyProfileRequest request) {

        return ResponseEntity.ok(elderlyProfileService.create(accountId, request));
    }

    @GetMapping
    public ResponseEntity<List<ElderlyProfileResponse>> getAll() {
        return ResponseEntity.ok(elderlyProfileService.getAll());
    }

    @GetMapping("{id}")
    public ResponseEntity getById(@PathVariable Long id) {
        return ResponseEntity.ok(elderlyProfileService.getById(id));
    }

    @PutMapping("{id}")
    public ResponseEntity update(@PathVariable Long id,
                                 @Valid @RequestBody ElderlyProfileRequest request) {

        return ResponseEntity.ok(elderlyProfileService.update(id, request));
    }

    @DeleteMapping("{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        elderlyProfileService.delete(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}