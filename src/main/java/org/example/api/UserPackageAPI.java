package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.model.request.UserPackageRequest;
import org.example.model.response.UserPackageResponse;
import org.example.service.UserPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-packages")
@SecurityRequirement(name = "api")
public class UserPackageAPI {
    @Autowired
    UserPackageService userPackageService;

    @PostMapping
    public UserPackageResponse create(@RequestBody UserPackageRequest request) {
        return userPackageService.create(request);
    }

    @GetMapping
    public List<UserPackageResponse> getAll() {
        return userPackageService.getAll();
    }

    @GetMapping("/{id}")
    public UserPackageResponse getById(@PathVariable Long id) {
        return userPackageService.getById(id);
    }

    @PutMapping("/{id}")
    public UserPackageResponse update(@PathVariable Long id,
                                      @RequestBody UserPackageRequest request) {
        return userPackageService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userPackageService.delete(id);
    }
}