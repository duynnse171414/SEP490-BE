package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.model.request.ReminderRequest;
import org.example.model.response.ReminderResponse;
import org.example.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@SecurityRequirement(name = "api")
public class ReminderAPI{
    @Autowired
    ReminderService service;

    @PostMapping
    public ReminderResponse create(@RequestBody ReminderRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<ReminderResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ReminderResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public ReminderResponse update(@PathVariable Long id,
                                   @RequestBody ReminderRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
