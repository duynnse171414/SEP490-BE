package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.model.request.SystemLogRequest;
import org.example.model.response.SystemLogResponse;
import org.example.service.SystemLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/system-logs")
@SecurityRequirement(name = "api")
public class SystemLogAPI {

    @Autowired
    SystemLogService systemLogService;


    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public SystemLogResponse create(@RequestBody SystemLogRequest request) {
        return systemLogService.create(request);
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public List<SystemLogResponse> getAll() {
        return systemLogService.getAll();
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public SystemLogResponse getById(@PathVariable Long id) {
        return systemLogService.getById(id);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public SystemLogResponse update(@PathVariable Long id,
                                    @RequestBody SystemLogRequest request) {
        return systemLogService.update(id, request);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public void delete(@PathVariable Long id) {
        systemLogService.delete(id);
    }
}