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

    // Bước 1: Gửi OTP reset password về email
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authenticationService.forgotPassword(request.getEmail());
        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP đã được gửi về email " + request.getEmail());
        return ResponseEntity.ok(response);
    }

    // Bước 2: Xác nhận OTP + đặt mật khẩu mới
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        authenticationService.resetPassword(request); // ✅ truyền request, không phải new
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
        return ResponseEntity.ok(response);
    }

    // Change password (đang login)
    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        authenticationService.changePassword(
                request.getCurrentPassword(),
                request.getNewPassword(),
                request.getConfirmPassword()
        );
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đổi mật khẩu thành công.");
        return ResponseEntity.ok(response);
    }

}
