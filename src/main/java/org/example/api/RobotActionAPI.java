package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.entity.RobotAction;
import org.example.repository.RobotActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/robot-action")
@SecurityRequirement(name = "api")

public class RobotActionAPI {

    @Autowired
    RobotActionRepository repo;

    // 👉 Web gọi
    @PostMapping
    public RobotAction create(@RequestBody Map<String, String> body) {
        RobotAction action = new RobotAction();
        action.setAction(body.get("action"));
        action.setExecuted(false);
        return repo.save(action);
    }

    // 👉 Robot gọi
    @GetMapping("/latest")
    public RobotAction getLatest() {
        return repo.findTopByExecutedFalseOrderByIdDesc()
                .orElse(null);
    }
    @PostMapping("/{id}/done")
    public String done(@PathVariable Long id) {
        RobotAction a = repo.findById(id).orElseThrow();
        a.setExecuted(true);
        repo.save(a);
        return "OK";
    }
}
