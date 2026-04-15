package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.entity.ExerciseScript;
import org.example.model.request.ServicePackageExerciseRequest;
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


//    @PostMapping
//    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
//    public ServicePackageResponse create(@RequestBody ServicePackageRequest request) {
//        return service.create(request);
//    }

    @PostMapping("/auto")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public ServicePackageResponse createAuto(@RequestBody ServicePackageRequest request) {
        return service.createAuto(request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public List<ServicePackageResponse> getAll() {
        return service.getAll();
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public ServicePackageResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/{pkgId}/exercises")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public List<ExerciseScript> getExercises(@PathVariable Long pkgId) {
        return service.getExercises(pkgId);
    }

//    @GetMapping("/{id}/available-exercises")
//    @PreAuthorize("hasAnyRole('CAREGIVER','ADMINISTRATOR','MANAGER')")
//    public List<ExerciseScript> getAvailableExercises(@PathVariable Long id) {
//        return service.getAvailableExercises(id);
//    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public ServicePackageResponse update(@PathVariable Long id,
                                         @RequestBody ServicePackageRequest request) {
        return service.update(id, request);
    }

    @PutMapping("/{pkgId}/exercises")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public void updateExercises(@PathVariable Long pkgId,
                                @RequestBody ServicePackageExerciseRequest request) {
        service.updateExercises(pkgId, request.getExerciseIds());
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
