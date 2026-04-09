package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.example.model.response.RobotResponse;
import org.example.model.request.RobotRequest;
import org.example.service.RobotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/robots")
@SecurityRequirement(name = "api")
public class RobotAPI {

    @Autowired
    RobotService robotService;


    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public ResponseEntity create(@Valid @RequestBody RobotRequest request) {
        return ResponseEntity.ok(robotService.create(request));
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public ResponseEntity<List<RobotResponse>> getAll() {
        return ResponseEntity.ok(robotService.getAll());
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER')")
    public ResponseEntity getById(@PathVariable Long id) {
        return ResponseEntity.ok(robotService.getById(id));
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public ResponseEntity update(@PathVariable Long id,
                                 @Valid @RequestBody RobotRequest request) {
        return ResponseEntity.ok(robotService.update(id, request));
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public ResponseEntity delete(@PathVariable Long id) {
        robotService.delete(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}
