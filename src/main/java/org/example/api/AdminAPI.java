package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.entity.Account;
import org.example.model.request.RegisterRequest;
import org.example.model.request.UpdateAccountRequest;
import org.example.model.response.AccountResponse;
import org.example.service.AuthenticationService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "api")
public class AdminAPI {

    @Autowired
    AuthenticationService authenticationService;

    @Autowired
    ModelMapper modelMapper;

    @PostMapping("admin/create-account")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public ResponseEntity createByAdmin(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.createByAdmin(request));
    }


    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccountById(@PathVariable Long id) {
        Account account = authenticationService.getAccountById(id);
        AccountResponse response = modelMapper.map(account, AccountResponse.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getAllAccount")
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        List<Account> accounts = authenticationService.getAllAccount();

        List<AccountResponse> response = accounts.stream()
                .map(acc -> modelMapper.map(acc, AccountResponse.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountResponse> updateAccount(
            @PathVariable Long id,
            @RequestBody UpdateAccountRequest updateAccountRequest
    ) {
        Account updated = authenticationService.updateAccount(id, updateAccountRequest);

        AccountResponse response = modelMapper.map(updated, AccountResponse.class);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long id) {
        authenticationService.deleteAccount(id);
        return ResponseEntity.ok("Account deleted successfully");
    }
}
