package org.example.api;


import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.model.request.ExerciseSessionRequest;
import org.example.model.response.ExerciseSessionResponse;
import org.example.service.ExerciseSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercise-sessions")
@SecurityRequirement(name = "api")
public class ExerciseSessionAPI {
    @Autowired
    ExerciseSessionService service;

    @PostMapping
    public ExerciseSessionResponse create(@RequestBody ExerciseSessionRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<ExerciseSessionResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ExerciseSessionResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public ExerciseSessionResponse update(@PathVariable Long id,
                                          @RequestBody ExerciseSessionRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
