package org.example.service;

import org.example.entity.Account;
import org.example.exception.DuplicateEntity;
import org.example.exception.NotFoundException;
import org.example.model.response.AccountResponse;
import org.example.model.request.LoginRequest;
import org.example.model.request.RegisterRequest;
import org.example.repository.AccountRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
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

    // Temporary store for OTPs
    private Map<String, String> otpStore = new HashMap<>();
    private Map<String, Long> otpExpirationStore = new HashMap<>();

    // Define the expiration time for OTPs (e.g., 5 minutes)
    private static final long OTP_EXPIRATION_TIME = 300000; // in milliseconds

    private boolean isOtpExpired(Long expirationTime) {
        return expirationTime == null || System.currentTimeMillis() > expirationTime;
    }


    public AccountResponse register(RegisterRequest registerRequest) {
        // map RegisterRequest => Account
        Account account = modelMapper.map(registerRequest, Account.class);

        // Kiểm tra gender ngay lập tức
        if (!account.getGender().equals("Male") && !account.getGender().equals("Female")) {
            throw new IllegalArgumentException("Not Valid Gender!");
        }

        // Kiểm tra xem số điện thoại đã tồn tại chưa
        if (accountRepository.findAccountByPhone(account.getPhone()) != null) {
            throw new DuplicateEntity("Duplicate phone!");
        }

        if (accountRepository.findByEmail(account.getEmail()) != null) {
            throw new DuplicateEntity("Duplicate Email!");
        }

        try {
            // Mã hóa mật khẩu
            String originPassword = account.getPassword();
            account.setPassword(passwordEncoder.encode(originPassword));

            // Lưu tài khoản mới vào database
            Account newAccount = accountRepository.save(account);

            // Trả về thông tin tài khoản đã tạo
            return modelMapper.map(newAccount, AccountResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("An unexpected error occurred: " + e.getMessage());
        }
    }


    public List<Account> getAllAccount() {
        List<Account> accounts = accountRepository.findAll();
        return accounts;
    }

    public Account getAccountById(Long accountId) {
        return accountRepository.findById(accountId).orElseThrow(() -> new NotFoundException("Account not found"));

    }

    public AccountResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getPhone(),
                    loginRequest.getPassword()
            ));
            Account account = (Account) authentication.getPrincipal();
            AccountResponse accountResponse = modelMapper.map(account, AccountResponse.class);
            accountResponse.setToken(tokenService.generateToken(account));
            return accountResponse;
        } catch (Exception e) {
            throw new NotFoundException("Username or password invalid!");
        }
    }

    @Override
    public UserDetails loadUserByUsername(String phone) throws UsernameNotFoundException {
        return accountRepository.findAccountByPhone(phone);
    }

    //ai đang gọi cái request này
    public Account getCurrentAccount() {
        Account account = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return accountRepository.findAccountById(account.getId());
    }

//    public Account updateAuthentication(Long authId, ChangInforRequest request) {
//        Account auth = accountRepository.findById(authId)
//                .orElseThrow(() -> new NotFoundException("Authentication not found for this id: " + authId));
//
//        auth.setFullName(request.getFullName());
//        auth.setGender(request.getGender());
//        auth.setEmail(request.getEmail());
//
//        return accountRepository.save(auth);
//    }

    public void changePassword(String currentPassword, String newPassword, String confirmPassword) {
        // Get the current authenticated account
        Account account = getCurrentAccount();

        // Verify that the current password matches the one in the database
        if (!passwordEncoder.matches(currentPassword, account.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }

        // Verify that the new password matches the confirm password
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

    // Phương pháp tạo OTP 6 chữ số ngẫu nhiên
    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    // Phương thức gửi OTP tới số điện thoại của người dùng
    private void sendOtpToPhoneNumber(String phoneNumber, String otp) {
        // Mô phỏng gửi OTP (thay thế bằng logic gửi SMS thực tế)
        System.out.println("Sending OTP " + otp + " to phone number: " + phoneNumber);
    }

    // Phương pháp gửi OTP để reset mật khẩu
    public String sendResetPasswordOtp(String phoneNumber) {
        String otp = generateOtp(); // Giả sử có phương pháp tạo OTP
        otpStore.put(phoneNumber, otp);
        otpExpirationStore.put(phoneNumber, System.currentTimeMillis() + OTP_EXPIRATION_TIME);
        sendOtpToPhoneNumber(phoneNumber, otp);
        return otp; // Trả về OTP đã tạo
    }

    // Phương pháp đặt lại mật khẩu (được xác định trước đó)
//    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
//        String phoneNumber = resetPasswordRequest.getPhoneNumber();
//        String otp = resetPasswordRequest.getOtp();
//        String newPassword = resetPasswordRequest.getNewPassword();
//        String confirmPassword = resetPasswordRequest.getConfirmPassword();
//
//        // Xác thực OTP
//        String storedOtp = otpStore.get(phoneNumber);
//        Long expirationTime = otpExpirationStore.get(phoneNumber);
//
//        // Kiểm tra OTP có hợp lệ và chưa hết hạn không
//        if (storedOtp == null || !storedOtp.equals(otp) || isOtpExpired(expirationTime)) {
//            throw new IllegalArgumentException("Invalid or expired OTP.");
//        }
//
//        // Tìm người dùng theo số điện thoại
//        Account user = accountRepository.findAccountByPhone(phoneNumber);
//        if (user == null) {
//            throw new IllegalArgumentException("User not found."); // Handle user not found case
//        }
//
//
//        // Kiểm tra xem mật khẩu mới có khớp với mật khẩu xác nhận không
//        if (!newPassword.equals(confirmPassword)) {
//            throw new IllegalArgumentException("New password and confirm password do not match.");
//        }
//
//        // Cập nhật mật khẩu
//        user.setPassword(passwordEncoder.encode(newPassword)); // Lưu trữ mật khẩu mới đã đô
//        accountRepository.save(user); // Lưu người dùng đã cập nhật
//
//        // Tùy chọn, xóa OTP sau khi xác thực thành công
//        otpStore.remove(phoneNumber);
//        otpExpirationStore.remove(phoneNumber);
//    }

    public Account deleteAccount(long accountId) {
        Account account = accountRepository.findAccountById(accountId);
        if (account == null) {
            throw new NotFoundException("Account not found");
        }
        account.setDeleted(true);
        return accountRepository.save(account);
    }

    public Account restoreAccount(long accountId) {
        Account account = accountRepository.findAccountById(accountId);
        if (account == null) {
            throw new NotFoundException("Account not found");
        }
        if (!account.isDeleted()) {
            throw new IllegalStateException("Account is not deleted");
        }
        account.setDeleted(false);
        return accountRepository.save(account);
    }
}