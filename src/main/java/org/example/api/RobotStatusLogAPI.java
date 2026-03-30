package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.model.request.RobotStatusLogRequest;
import org.example.model.response.RobotStatusLogResponse;
import org.example.service.RobotStatusLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/robot-status-logs")
@SecurityRequirement(name = "api")
public class RobotStatusLogAPI {

    @Autowired
    RobotStatusLogService service;

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public RobotStatusLogResponse create(@RequestBody RobotStatusLogRequest request) {
        return service.create(request);
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public List<RobotStatusLogResponse> getAll() {
        return service.getAll();
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER')")
    public RobotStatusLogResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }


    @GetMapping("/robot/{robotId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER')")
    public List<RobotStatusLogResponse> getByRobot(@PathVariable Long robotId) {
        return service.getByRobot(robotId);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}