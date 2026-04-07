package org.example.api;


import org.example.entity.Account;
import org.example.model.request.UpdateAccountRequest;
import org.example.model.response.AccountResponse;
import org.example.model.request.LoginRequest;
import org.example.model.request.RegisterRequest;
import org.example.service.AuthenticationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@SecurityRequirement(name = "api")
@RestController
@RequestMapping("api")

public class AuthenticationAPI {

    // DI: Dependency Injection
    @Autowired
    AuthenticationService authenticationService;

    @Autowired
    ModelMapper modelMapper;

    @PostMapping("register")
    public ResponseEntity register(@Valid @RequestBody RegisterRequest registerRequest) {
        AccountResponse newAccount = authenticationService.register(registerRequest);
        return ResponseEntity.ok(newAccount);
    }

    @PostMapping("login")
    public ResponseEntity login(@Valid @RequestBody LoginRequest loginRequest) {
        AccountResponse newAccount = authenticationService.login(loginRequest);
        return ResponseEntity.ok(newAccount);
    }

    @PostMapping("verify-otp")
    public ResponseEntity verifyOtp(@RequestParam String email,
                                    @RequestParam String otp) {
        authenticationService.verifyOtp(email, otp);
        return ResponseEntity.ok("Verify OTP successfully!");
    }

}
