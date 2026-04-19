package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.entity.ExerciseScript;
import org.example.entity.RobotActionLibrary;
import org.example.model.request.ServicePackageExerciseRequest;
import org.example.model.request.ServicePackageRequest;
import org.example.model.response.RobotActionResponse;
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
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','FAMILYMEMBER','CAREGIVER')")
    public List<ServicePackageResponse> getAll() {
        return service.getAll();
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','FAMILYMEMBER','CAREGIVER')")
    public ServicePackageResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }


    @GetMapping("/{id}/robot-actions")
    public List<RobotActionLibrary> getRobotActions(@PathVariable Long id) {
        return service.getRobotActions(id);
    }

    @GetMapping("/level/{level}")
    public List<ServicePackageResponse> getByLevel(@PathVariable String level) {
        return service.getByLevel(level);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public ServicePackageResponse update(@PathVariable Long id,
                                         @RequestBody ServicePackageRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }


//    // GET package theo account
//    @GetMapping("/account/{accountId}")
//    public List<ServicePackageResponse> getByAccount(@PathVariable Long accountId) {
//        return service.getPackagesByAccount(accountId);
//    }
}
