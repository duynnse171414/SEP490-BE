package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.model.request.RobotStatusLogRequest;
import org.example.model.response.RobotStatusLogResponse;
import org.example.service.RobotStatusLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/robot-status-logs")
@SecurityRequirement(name = "api")
public class RobotStatusLogAPI {
    @Autowired
    RobotStatusLogService service;

    @PostMapping
    public RobotStatusLogResponse create(@RequestBody RobotStatusLogRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<RobotStatusLogResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public RobotStatusLogResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/robot/{robotId}")
    public List<RobotStatusLogResponse> getByRobot(@PathVariable Long robotId) {
        return service.getByRobot(robotId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}