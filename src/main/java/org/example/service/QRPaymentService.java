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
    public void handlePaymentSuccess(String description, Double amount) {

        Long userPackageId = extractUserPackageId(description);

        UserPackage userPackage = userPackageRepository.findById(userPackageId)
                .orElseThrow(() -> new RuntimeException("UserPackage not found"));

        // ✅ chống duplicate webhook
        if (userPackage.getStatus() == PaymentStatus.PAID) {
            System.out.println("⚠️ Duplicate webhook ignored");
            return;
        }

        ServicePackage servicePackage = userPackage.getServicePackage();

        // check tiền
        if (Double.compare(servicePackage.getPrice(), amount) != 0) {
            userPackage.setStatus(PaymentStatus.FAILED);
            userPackageRepository.save(userPackage);
            throw new RuntimeException("Invalid amount");
        }

        // update
        userPackage.setStatus(PaymentStatus.PAID);

        LocalDateTime now = LocalDateTime.now();
        userPackage.setAssignedAt(now);

        if (servicePackage.getDurationDays() != null) {
            userPackage.setExpiredAt(now.plusDays(servicePackage.getDurationDays()));
        }

        userPackageRepository.save(userPackage);

        System.out.println("✅ Payment success processed");
    }

    @lombok.Data
    @lombok.Builder
    public static class PaymentInfo {
        private String checkoutUrl;
        private Double amount;
        private String description;
    }
}
