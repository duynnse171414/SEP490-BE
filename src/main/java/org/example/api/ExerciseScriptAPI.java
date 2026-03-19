package org.example.api;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.model.request.ExerciseScriptRequest;
import org.example.model.response.ExerciseScriptResponse;
import org.example.service.ExerciseScriptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercise-scripts")
@SecurityRequirement(name = "api")
public class ExerciseScriptAPI{
     @Autowired
     ExerciseScriptService service;

    @PostMapping
    public ExerciseScriptResponse create(@RequestBody ExerciseScriptRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<ExerciseScriptResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ExerciseScriptResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public ExerciseScriptResponse update(@PathVariable Long id,
                                         @RequestBody ExerciseScriptRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
