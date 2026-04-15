package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.model.request.UserPackageRequest;
import org.example.model.response.UserPackageResponse;
import org.example.service.UserPackageService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-packages")
@RequiredArgsConstructor
@SecurityRequirement(name = "api")
public class UserPackageAPI {

    private final UserPackageService userPackageService;

    // ================= CREATE =================
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public UserPackageResponse create(@RequestBody UserPackageRequest request) {
        return userPackageService.create(request);
    }

    // ================= GET ALL =================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','FAMILYMEMBER')")
    public List<UserPackageResponse> getAll() {
        return userPackageService.getAll();
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER','FAMILYMEMBER')")
    public UserPackageResponse getById(@PathVariable Long id) {
        return userPackageService.getById(id);
    }

    // ================= GET BY ELDERLY =================
    @GetMapping("/elderly/{elderlyId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER','CAREGIVER','FAMILYMEMBER')")
    public List<UserPackageResponse> getByElderly(@PathVariable Long elderlyId) {
        return userPackageService.getByElderlyId(elderlyId);
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public UserPackageResponse update(@PathVariable Long id,
                                      @RequestBody UserPackageRequest request) {
        return userPackageService.update(id, request);
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public void delete(@PathVariable Long id) {
        userPackageService.delete(id);
    }
}