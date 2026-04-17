package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.model.response.UserPackageResponse;
import org.example.repository.AccountRepository;
import org.example.repository.ElderlyProfileRepository;
import org.example.repository.ServicePackageRepository;
import org.example.repository.UserPackageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QRPaymentService {

    private final UserPackageRepository userPackageRepository;
    private final AccountRepository accountRepository;
    private final ServicePackageRepository servicePackageRepository;
    private final ElderlyProfileRepository elderlyProfileRepository;

    private static final String BANK_ID = "970407";
    private static final String ACCOUNT_NO = "19074497420010";
    private static final String ACCOUNT_NAME = "NGUYEN TRAN GIA HUNG";
    private static final String TEMPLATE = "compact2";

    // ===================== CREATE PAYMENT =====================
    @Transactional
    public PaymentInfo createPayment(Account account, ServicePackage servicePackage, Long elderlyId) {

        ElderlyProfile elderly = elderlyProfileRepository.findById(elderlyId)
                .orElseThrow(() -> new RuntimeException("Elderly not found"));

        // ❗ check nếu đang có PENDING thì không cho tạo payment mới
        boolean hasPending = userPackageRepository
                .existsByElderlyProfile_IdAndStatusAndDeletedFalse(elderlyId, PaymentStatus.PENDING);

        if (hasPending) {
            throw new RuntimeException("Elderly already has a pending payment");
        }

        // (Optional) ❗ check luôn ACTIVE nếu bạn muốn chặn mua khi đang dùng
        boolean hasActive = userPackageRepository
                .existsByElderlyProfile_IdAndStatusAndDeletedFalse(elderlyId, PaymentStatus.PENDING);

        if (hasActive) {
            throw new RuntimeException("Elderly already has an active package");
        }

        // 👉 tạo UserPackage PENDING
        UserPackage userPackage = new UserPackage();
        userPackage.setAccount(account);
        userPackage.setServicePackage(servicePackage);
        userPackage.setElderlyProfile(elderly);
        userPackage.setAssignedAt(LocalDateTime.now());
        userPackage.setDeleted(false);
        userPackage.setStatus(PaymentStatus.PENDING);

        userPackageRepository.save(userPackage);

        // 👉 description dùng ID của userPackage luôn
        String description = "UP:" + userPackage.getId();

        String qrUrl = generatePaymentQR(description, servicePackage.getPrice());

        return PaymentInfo.builder()
                .qrCodeUrl(qrUrl)
                .amount(servicePackage.getPrice())
                .description(description)
                .build();
    }

    // ===================== GENERATE QR =====================
    private String generatePaymentQR(String description, Double amount) {

        String encodedDescription = URLEncoder.encode(description, StandardCharsets.UTF_8);

        return String.format(
                "https://img.vietqr.io/image/%s-%s-%s.png?amount=%s&addInfo=%s&accountName=%s",
                BANK_ID,
                ACCOUNT_NO,
                TEMPLATE,
                amount.intValue(),
                encodedDescription,
                URLEncoder.encode(ACCOUNT_NAME, StandardCharsets.UTF_8)
        );
    }

    private String buildDescription(Long accountId, Long servicePackageId, Long elderlyId) {
        return String.format("PKG:%d|ACC:%d|ELD:%d", servicePackageId, accountId, elderlyId);
    }

    // ===================== HANDLE SUCCESS PAYMENT =====================
    @Transactional
    public void handlePaymentSuccess(String description, Double amount) {

        Long userPackageId = extractUserPackageId(description);

        UserPackage userPackage = userPackageRepository.findById(userPackageId)
                .orElseThrow(() -> new RuntimeException("UserPackage not found"));

        if (userPackage.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Already processed");
        }

        ServicePackage servicePackage = userPackage.getServicePackage();

        // check tiền
        if (Double.compare(servicePackage.getPrice(), amount) != 0) {
            throw new RuntimeException("Invalid amount");
        }

        // 👉 update trạng thái
        userPackage.setStatus(PaymentStatus.PAID);

        LocalDateTime now = LocalDateTime.now();
        userPackage.setAssignedAt(now);

        if (servicePackage.getDurationDays() != null) {
            userPackage.setExpiredAt(now.plusDays(servicePackage.getDurationDays()));
        }

        userPackageRepository.save(userPackage);

        System.out.println("✅ Payment confirmed!");
    }

    // ===================== PARSE =====================
    private Long extractUserPackageId(String desc) {
        try {
            return Long.parseLong(desc.replace("UP:", ""));
        } catch (Exception e) {
            throw new RuntimeException("Invalid description format: " + desc);
        }
    }



    // ===================== DTO =====================
    @lombok.Data
    @lombok.Builder
    public static class PaymentInfo {
        private String qrCodeUrl;
        private Double amount;
        private String description;
    }
}