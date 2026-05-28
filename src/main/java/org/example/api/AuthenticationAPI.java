package org.example.api;


import org.example.entity.Account;
import org.example.model.request.*;
import org.example.model.response.AccountResponse;
import org.example.service.AuthenticationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@SecurityRequirement(name = "api")
@RestController
@RequestMapping("api")

public class AuthenticationAPI {

    @Autowired
    AuthenticationService authenticationService;

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

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authenticationService.forgotPassword(request.getEmail());
        Map<String, String> response = new HashMap<>();
        response.put("message", "The OTP has been sent to your email." + request.getEmail());
        return ResponseEntity.ok(response);
    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        authenticationService.resetPassword(request);
        Map<String, String> response = new HashMap<>();
        response.put("message",
                "Password reset successful. Please log in again.");
        return ResponseEntity.ok(response);
    }


    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        authenticationService.changePassword(
                request.getCurrentPassword(),
                request.getNewPassword(),
                request.getConfirmPassword()
        );
        Map<String, String> response = new HashMap<>();
        response.put("message",
                "Password changed successfully.");
        return ResponseEntity.ok(response);
    }

}
