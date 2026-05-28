package org.example.service;

import org.example.entity.Account;
import org.example.entity.CaregiverProfile;
import org.example.entity.Role;
import org.example.exception.DuplicateEntity;
import org.example.exception.NotFoundException;
import org.example.model.request.ResetPasswordRequest;
import org.example.model.request.UpdateAccountRequest;
import org.example.model.response.AccountResponse;
import org.example.model.request.LoginRequest;
import org.example.model.request.RegisterRequest;
import org.example.repository.AccountRepository;
import org.example.repository.CaregiverProfileRepository;
import org.example.repository.ElderlyProfileRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class AuthenticationService implements UserDetailsService {

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    TokenService tokenService;

    @Autowired
    EmailService emailService;

    @Autowired
    CaregiverProfileRepository caregiverProfileRepository;

    private static final long OTP_EXPIRATION_TIME = 300000; // in milliseconds

    private boolean isOtpExpired(Long expirationTime) {
        return expirationTime == null || System.currentTimeMillis() > expirationTime;
    }


    public AccountResponse register(RegisterRequest registerRequest) {
        Account account = modelMapper.map(registerRequest, Account.class);

        if (!account.getGender().equals("Male") && !account.getGender().equals("Female")) {
            throw new IllegalArgumentException("Not Valid Gender!");
        }

        if (accountRepository.findAccountByPhone(account.getPhone()) != null) {
            throw new DuplicateEntity("Duplicate phone!");
        }


        String originPassword = account.getPassword();
        account.setPassword(passwordEncoder.encode(originPassword));

        account.setVerified(false);
        account.setRole(Role.valueOf("FAMILYMEMBER"));

        String otp = generateOtp();

        account.setOtp(otp);
        account.setOtpExpiredAt(System.currentTimeMillis() + OTP_EXPIRATION_TIME);

        Account newAccount = accountRepository.save(account);


        emailService.sendOtpEmail(account.getEmail(), otp);

        AccountResponse response = modelMapper.map(newAccount, AccountResponse.class);
        response.setMessage("Register successfully. Please verify OTP sent to your email.");

        return response;
    }


    public List<Account> getAllAccount() {
        List<Account> accounts = accountRepository.findByDeletedFalse();
        return accounts;
    }


    public Account getAccountById(Long accountId) {
        Account account = accountRepository.findAccountById(accountId);

        if (account == null || account.isDeleted()) {
            throw new NotFoundException("Account not found");
        }

        return account;
    }

    public AccountResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            Account account = (Account) authentication.getPrincipal();

            if (!account.isVerified() && account.getRole() == Role.FAMILYMEMBER) {
                throw new IllegalStateException("Account chưa verify OTP");
            }

            AccountResponse accountResponse = modelMapper.map(account, AccountResponse.class);
            accountResponse.setToken(tokenService.generateToken(account));

            return accountResponse;

        } catch (Exception e) {
            throw new NotFoundException("Username or password invalid!");
        }
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found"));

        return account;
    }


    public Account getCurrentAccount() {
        Account account = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return accountRepository.findAccountById(account.getId());
    }

    public void verifyOtp(String email, String otp) {

        String trimmedEmail = email.trim();

        Account account = accountRepository.findByEmail(trimmedEmail)
                .orElseThrow(() -> new RuntimeException("Not found account with email: " + trimmedEmail));

        if (account.getOtp() == null) {
            throw new IllegalArgumentException("The OTP has either not been generated or has already been verified.");
        }

        if (!account.getOtp().equals(otp)) {
            throw new IllegalArgumentException("Incorrect OTP");
        }

        if (System.currentTimeMillis() > account.getOtpExpiredAt()) {
            throw new IllegalArgumentException("OTP has expired.");
        }

        account.setVerified(true);
        account.setOtp(null);
        account.setOtpExpiredAt(null);

        accountRepository.save(account);
    }

    public void changePassword(String currentPassword, String newPassword, String confirmPassword) {
        // Get the current authenticated account
        Account account = getCurrentAccount();

        // Verify that the current password matches the one in the database
        if (!passwordEncoder.matches(currentPassword, account.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }


        if (!newPassword.equals(confirmPassword)) {
            throw new IllegalArgumentException("New password and confirm password do not match.");
        }
        // Check if the new password is the same as the current password
        if (newPassword.equals(currentPassword)) {
            throw new IllegalArgumentException("New password cannot be the same as the current password.");
        }


        // Set the new password and save the account
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
    }


    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }


    public Account deleteAccount(long accountId) {
        Account account = accountRepository.findAccountById(accountId);
        if (account == null) {
            throw new NotFoundException("Account not found");
        }
        account.setDeleted(true);
        return accountRepository.save(account);
    }

    public Account updateAccount(Long id, UpdateAccountRequest updateRequest) {
        Account account = accountRepository.findAccountById(id);

        if (account == null) {
            throw new NotFoundException("Account not found");
        }


        if (updateRequest.getFullName() != null) {
            account.setFullName(updateRequest.getFullName());
        }

        if (updateRequest.getPhone() != null) {
            account.setPhone(updateRequest.getPhone());
        }

        if (updateRequest.getGender() != null) {
            account.setGender(updateRequest.getGender());
        }
        if (updateRequest.getPassword() != null) {
            account.setPassword(passwordEncoder.encode(updateRequest.getPassword())); // ✅
        }


        if (updateRequest.getRole() != null) {
            account.setRole(updateRequest.getRole());
        }


        if (updateRequest.getDeleted() != account.isDeleted()) {
            account.setDeleted(updateRequest.getDeleted());
        }

        return accountRepository.save(account);
    }

    public AccountResponse createByAdmin(RegisterRequest request) {

        Account account = modelMapper.map(request, Account.class);

        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setRole(request.getRole());
        account.setVerified(true);

        Account savedAccount = accountRepository.save(account);


        if (savedAccount.getRole() == Role.CAREGIVER) {
            CaregiverProfile profile = new CaregiverProfile();
            profile.setAccount(savedAccount);
            profile.setName(savedAccount.getFullName()); // optional
            caregiverProfileRepository.save(profile);
        }

        return modelMapper.map(savedAccount, AccountResponse.class);
    }


    public void forgotPassword(String email) {

        Account account = accountRepository.findByEmail(email.trim())
                .orElseThrow(() -> new NotFoundException("Account not found with email: " + email));

        if (account.isDeleted()) {
            throw new NotFoundException("Account not found");
        }

        String otp = generateOtp();
        account.setResetPasswordOtp(otp);
        account.setResetPasswordOtpExpiredAt(System.currentTimeMillis() + OTP_EXPIRATION_TIME);
        accountRepository.save(account);

        emailService.sendResetPasswordOtp(account.getEmail(), otp);
    }


    public void resetPassword(ResetPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("The email address cannot be blank.");
        }
        if (request.getOtp() == null || request.getOtp().isBlank()) {
            throw new IllegalArgumentException("The OTP can not be blank.");
        }
        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            throw new IllegalArgumentException("The password can not blank.");
        }
        if (request.getConfirmPassword() == null || request.getConfirmPassword().isBlank()) {
            throw new IllegalArgumentException("The confirmation password can not be blank.");
        }

        Account account = accountRepository.findByEmail(request.getEmail().trim())
                .orElseThrow(() -> new NotFoundException("Account not found"));

        if (account.getResetPasswordOtp() == null) {
            throw new IllegalArgumentException("OTP not generated. Please request again.");
        }

        if (!account.getResetPasswordOtp().equals(request.getOtp())) {
            throw new IllegalArgumentException("The OTP is incorrect.");
        }

        if (System.currentTimeMillis() > account.getResetPasswordOtpExpiredAt()) {
            throw new IllegalArgumentException("The OTP has expired. Please request it again.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("The confirmation password doesn't match.");
        }

        if (passwordEncoder.matches(request.getNewPassword(), account.getPassword())) {
                throw new IllegalArgumentException("The new password must not be the same as the old password.");
        }

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        account.setResetPasswordOtp(null);
        account.setResetPasswordOtpExpiredAt(null);
        accountRepository.save(account);
    }
}
