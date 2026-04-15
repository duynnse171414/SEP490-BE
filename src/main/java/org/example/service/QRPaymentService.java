package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.Account;
import org.example.entity.ElderlyProfile;
import org.example.entity.ServicePackage;
import org.example.entity.UserPackage;
import org.example.repository.AccountRepository;
import org.example.repository.ElderlyProfileRepository;
import org.example.repository.ServicePackageRepository;
import org.example.repository.UserPackageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

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
    public PaymentInfo createPayment(Account account, ServicePackage servicePackage, Long elderlyId) {

        String description = buildDescription(account.getId(), servicePackage.getId(), elderlyId);

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

        System.out.println("🔥 handlePaymentSuccess called");
        System.out.println("DESC: " + description);
        System.out.println("AMOUNT: " + amount);

        Long accountId = extractValue(description, "ACC");
        Long servicePackageId = extractValue(description, "PKG");
        Long elderlyId = extractValue(description, "ELD");

        System.out.println("Parsed -> ACC=" + accountId +
                ", PKG=" + servicePackageId +
                ", ELD=" + elderlyId);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        ServicePackage servicePackage = servicePackageRepository.findById(servicePackageId)
                .orElseThrow(() -> new RuntimeException("ServicePackage not found"));

        ElderlyProfile elderly = elderlyProfileRepository.findById(elderlyId)
                .orElseThrow(() -> new RuntimeException("Elderly not found"));

        // ✅ check amount
        if (Double.compare(servicePackage.getPrice(), amount) != 0) {
            throw new RuntimeException("Invalid amount");
        }

        // ✅ check duplicate
        boolean exists = userPackageRepository
                .existsByAccount_IdAndServicePackage_IdAndElderlyProfile_IdAndDeletedFalse(
                        accountId, servicePackageId, elderlyId
                );

        if (exists) {
            throw new RuntimeException("Package already purchased for this elderly");
        }

        // ✅ CREATE
        UserPackage userPackage = new UserPackage();
        userPackage.setAccount(account);
        userPackage.setServicePackage(servicePackage);
        userPackage.setElderlyProfile(elderly);

        LocalDateTime now = LocalDateTime.now();
        userPackage.setAssignedAt(now);

        if (servicePackage.getDurationDays() != null) {
            userPackage.setExpiredAt(now.plusDays(servicePackage.getDurationDays()));
        }

        userPackage.setDeleted(false);

        userPackageRepository.save(userPackage);

        System.out.println("✅ UserPackage saved successfully!");
    }

    // ===================== PARSE =====================
    private Long extractValue(String desc, String key) {

        if (desc == null || !desc.contains("|")) {
            throw new RuntimeException("Invalid description format: " + desc);
        }

        String[] parts = desc.split("\\|");

        for (String part : parts) {
            if (part.startsWith(key + ":")) {
                return Long.parseLong(part.split(":")[1]);
            }
        }

        throw new RuntimeException("Missing key: " + key + " in desc: " + desc);
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