package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.ServicePackage;
import org.example.entity.UserPackage;
import org.example.repository.UserPackageRepository;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class QRPaymentService {

    private final UserPackageRepository userPackageRepository;

    private static final String BANK_ID = "970407";
    private static final String ACCOUNT_NO = "19074497420010";
    private static final String ACCOUNT_NAME = "NGUYEN TRAN GIA HUNG";
    private static final String TEMPLATE = "compact2";

    // ===================== CREATE PAYMENT =====================
    public PaymentInfo createPayment(UserPackage userPackage, Double amount) {
        String qrUrl = generatePaymentQR(userPackage.getId(), amount);

        return PaymentInfo.builder()
                .qrCodeUrl(qrUrl)
                .bankId(BANK_ID)
                .accountNo(ACCOUNT_NO)
                .accountName(ACCOUNT_NAME)
                .amount(amount)
                .description(buildDescription(userPackage.getId()))
                .userPackageId(userPackage.getId())
                .status("PENDING")
                .build();
    }

    // ===================== GENERATE QR =====================
    private String generatePaymentQR(Long userPackageId, Double amount) {
        try {
            String description = buildDescription(userPackageId);

            String encodedDescription = URLEncoder.encode(
                    description,
                    StandardCharsets.UTF_8.toString()
            );

            return String.format(
                    "https://img.vietqr.io/image/%s-%s-%s.png?amount=%s&addInfo=%s&accountName=%s",
                    BANK_ID,
                    ACCOUNT_NO,
                    TEMPLATE,
                    amount.intValue(),
                    encodedDescription,
                    URLEncoder.encode(ACCOUNT_NAME, StandardCharsets.UTF_8.toString())
            );

        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Error generating QR code", e);
        }
    }

    private String buildDescription(Long userPackageId) {
        return "PETVIBE UP " + userPackageId;
    }

    // ===================== HANDLE SUCCESS PAYMENT =====================
    public void handlePaymentSuccess(Long userPackageId) {
        UserPackage userPackage = userPackageRepository.findById(userPackageId)
                .orElseThrow(() -> new RuntimeException("UserPackage not found"));

        ServicePackage servicePackage = userPackage.getServicePackage();

        userPackage.setAssignedAt(LocalDateTime.now());

        // giả sử ServicePackage có durationDays
        userPackage.setExpiredAt(
                LocalDateTime.now().plusDays(servicePackage.getDurationDays())
        );

        userPackageRepository.save(userPackage);
    }

    // ===================== DTO =====================
    @lombok.Data
    @lombok.Builder
    public static class PaymentInfo {
        private String qrCodeUrl;
        private String bankId;
        private String accountNo;
        private String accountName;
        private Double amount;
        private String description;
        private Long userPackageId;

        @lombok.Builder.Default
        private String status = "PENDING";
    }
}