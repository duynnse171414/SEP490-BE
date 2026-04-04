package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.model.request.RegisterRequest;
import org.example.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "api")
public class AdminAPI {

    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("admin/create-account")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public ResponseEntity createByAdmin(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.createByAdmin(request));
    }
}
