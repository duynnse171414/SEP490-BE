package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.model.request.ServicePackageRequest;
import org.example.model.response.ServicePackageResponse;
import org.example.service.ServicePackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-packages")
@SecurityRequirement(name = "api")
public class ServicePackageAPI {

    @Autowired
    ServicePackageService service;


    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATOR','MANAGER')")
    public ServicePackageResponse create(@RequestBody ServicePackageRequest request) {
        return service.create(request);
    }


    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<ServicePackageResponse> getAll() {
        return service.getAll();
    }


    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ServicePackageResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR','MANAGER')")
    public ServicePackageResponse update(@PathVariable Long id,
                                         @RequestBody ServicePackageRequest request) {
        return service.update(id, request);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR','MANAGER')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
