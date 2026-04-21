package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.repository.ElderlyProfileRepository;
import org.example.repository.UserPackageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@RequiredArgsConstructor
@Service
public class QRPaymentService {

    private final UserPackageRepository userPackageRepository;
    private final ElderlyProfileRepository elderlyProfileRepository;
    private final PayOSService payOSService;

    @Transactional
    public PaymentInfo createPayment(Account account,
                                     ServicePackage servicePackage,
                                     Long elderlyId) {

        ElderlyProfile elderly = elderlyProfileRepository.findById(elderlyId)
                .orElseThrow(() -> new RuntimeException("Elderly not found"));

        // check pending
        if (userPackageRepository.existsByElderlyProfile_IdAndStatusAndDeletedFalse(
                elderlyId, PaymentStatus.PENDING)) {
            throw new RuntimeException("Already has pending payment");
        }

        // check active
        if (userPackageRepository.existsByElderlyProfile_IdAndStatusAndDeletedFalse(
                elderlyId, PaymentStatus.PAID)) {
            throw new RuntimeException("Already has active package");
        }

        // tạo userPackage
        UserPackage userPackage = new UserPackage();
        userPackage.setAccount(account);
        userPackage.setServicePackage(servicePackage);
        userPackage.setElderlyProfile(elderly);
        userPackage.setStatus(PaymentStatus.PENDING);
        userPackage.setAssignedAt(java.time.LocalDateTime.now());
        userPackage.setDeleted(false);

        userPackageRepository.save(userPackage);

        String description = "UP:" + userPackage.getId();

        // 👉 gọi PayOS
        String checkoutUrl = payOSService.createPaymentLink(
                org.example.model.request.PayOSRequest.builder()
                        .orderCode(userPackage.getId())
                        .amount((int) servicePackage.getPrice())
                        .description(description)
                        .returnUrl("http://localhost:3000/success")
                        .cancelUrl("http://localhost:3000/cancel")
                        .build()
        );

        return PaymentInfo.builder()
                .checkoutUrl(checkoutUrl)
                .amount(servicePackage.getPrice())
                .description(description)
                .build();
    }

    private Long extractUserPackageId(String desc) {
        try {
            return Long.parseLong(desc.replace("UP:", ""));
        } catch (Exception e) {
            throw new RuntimeException("Invalid description format: " + desc);
        }
    }

    @Transactional
    public void handlePaymentSuccess(Long orderCode, Double amount) {

        // ✅ orderCode chính là userPackage.getId()
        UserPackage userPackage = userPackageRepository.findById(orderCode)
                .orElseThrow(() -> new RuntimeException("UserPackage not found: " + orderCode));

        // ✅ Chống duplicate webhook
        if (userPackage.getStatus() == PaymentStatus.PAID) {
            System.out.println("⚠️ Duplicate webhook ignored for orderCode: " + orderCode);
            return;
        }

        ServicePackage servicePackage = userPackage.getServicePackage();

        // ✅ So sánh amount dùng long (tránh lỗi floating point)
        // ✅ cast trực tiếp vì getPrice() là primitive double
        long expectedAmount = (long) servicePackage.getPrice();
        long actualAmount = amount.longValue(); // amount vẫn là Double (wrapper) nên ok

        if (expectedAmount != actualAmount) {
            userPackage.setStatus(PaymentStatus.FAILED);
            userPackageRepository.save(userPackage);
            throw new RuntimeException("Amount mismatch: expected=" + expectedAmount + ", actual=" + actualAmount);
        }

        // ✅ Cập nhật trạng thái
        LocalDateTime now = LocalDateTime.now();
        userPackage.setStatus(PaymentStatus.PAID);
        userPackage.setAssignedAt(now);

        if (servicePackage.getDurationDays() != null) {
            userPackage.setExpiredAt(now.plusDays(servicePackage.getDurationDays()));
        }

        userPackageRepository.save(userPackage);
        System.out.println("✅ UserPackage " + orderCode + " → PAID, expires: " + userPackage.getExpiredAt());
    }

    @lombok.Data
    @lombok.Builder
    public static class PaymentInfo {
        private String checkoutUrl;
        private Double amount;
        private String description;
    }
}
