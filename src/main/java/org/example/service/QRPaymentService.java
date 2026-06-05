package org.example.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.entity.*;
import org.example.exception.BadRequestException;
import org.example.exception.NotFoundException;
import org.example.model.request.PayOSRequest;
import org.example.repository.ElderlyProfileRepository;
import org.example.repository.UserPackageRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Slf4j
@Service
@RequiredArgsConstructor
public class QRPaymentService {

    private final UserPackageRepository userPackageRepository;
    private final ElderlyProfileRepository elderlyProfileRepository;
    private final PayOSService payOSService;

    @Value("${payos.return-url:http://localhost:3000/success}")
    private String returnUrl;

    @Value("${payos.cancel-url:http://localhost:3000/cancel}")
    private String cancelUrl;


    @Transactional
    public PaymentInfo createPayment(Account account,
                                     ServicePackage servicePackage,
                                     Long elderlyId) {

        ElderlyProfile elderly = elderlyProfileRepository.findById(elderlyId)
                .orElseThrow(() -> new NotFoundException("Elderly not found"));


        if (userPackageRepository.existsByElderlyProfile_IdAndStatusAndDeletedFalse(
                elderlyId, PaymentStatus.PENDING)) {
            throw new BadRequestException("This elderly already has a pending payment.");
        }
//check upgrade package
        userPackageRepository
                .findByElderlyProfile_IdAndStatusAndDeletedFalse(elderlyId, PaymentStatus.PAID)
                .ifPresent(active -> {
                    PackageLevel currentLevel = PackageLevel.valueOf(
                            active.getServicePackage().getLevel().toUpperCase());
                    PackageLevel newLevel = PackageLevel.valueOf(
                            servicePackage.getLevel().toUpperCase());

                    if (newLevel.getRank() < currentLevel.getRank()) {
                        throw new BadRequestException(
                                "It's not possible to downgrade to a lower package. " + "Current package: " + currentLevel + ",New package: " + newLevel);
                    }
                });

        UserPackage userPackage = new UserPackage();
        userPackage.setAccount(account);
        userPackage.setServicePackage(servicePackage);
        userPackage.setElderlyProfile(elderly);
        userPackage.setStatus(PaymentStatus.PENDING);
        userPackage.setAssignedAt(LocalDateTime.now());
        userPackage.setDeleted(false);
        userPackageRepository.save(userPackage);

        String description = "UP:" + userPackage.getId();

        String checkoutUrl = payOSService.createPaymentLink(
                PayOSRequest.builder()
                        .orderCode(userPackage.getId())
                        .amount((int) Math.round(servicePackage.getPrice()))
                        .description(description)
                        .returnUrl(returnUrl)
                        .cancelUrl(cancelUrl)
                        .build()
        );
        userPackage.setCheckoutUrl(checkoutUrl);
        userPackageRepository.save(userPackage);

        log.info("Created PENDING UserPackage id={} for elderlyId={}, amount={}",
                userPackage.getId(), elderlyId, servicePackage.getPrice());

        return PaymentInfo.builder()
                .checkoutUrl(checkoutUrl)
                .amount(servicePackage.getPrice())
                .description(description)
                .build();
    }



    @Transactional
    public void handlePaymentSuccess(Long orderCode, Double amount) {

        UserPackage userPackage = userPackageRepository.findById(orderCode)
                .orElseThrow(() -> new NotFoundException("UserPackage not found: " + orderCode));

        // Idempotent: ignore duplicate webhook
        if (userPackage.getStatus() == PaymentStatus.PAID) {
            log.warn("Duplicate webhook ignored for orderCode={}", orderCode);
            return;
        }

        ServicePackage servicePackage = userPackage.getServicePackage();
        long expectedAmount = Math.round(servicePackage.getPrice());
        long actualAmount   = Math.round(amount);

        if (expectedAmount != actualAmount) {
            userPackage.setStatus(PaymentStatus.FAILED);
            userPackageRepository.save(userPackage);
            log.error("Amount mismatch for orderCode={}: expected={}, actual={}",
                    orderCode, expectedAmount, actualAmount);
            return;
        }

        Long elderlyId = userPackage.getElderlyProfile().getId();
//replace old package
        userPackageRepository
                .findByElderlyProfile_IdAndStatusAndDeletedFalse(elderlyId, PaymentStatus.PAID)
                .ifPresent(oldPackage -> {
                    oldPackage.setStatus(PaymentStatus.REPLACED);
                    userPackageRepository.save(oldPackage);
                    log.info("UserPackage {} -> REPLACED by new package {}",
                            oldPackage.getId(), orderCode);
                });

        LocalDateTime now = LocalDateTime.now();
        userPackage.setStatus(PaymentStatus.PAID);
        userPackage.setAssignedAt(now);
        if (servicePackage.getDurationDays() != null) {
            userPackage.setExpiredAt(now.plusDays(servicePackage.getDurationDays()));
        }
        userPackageRepository.save(userPackage);

        log.info("UserPackage {} -> PAID, expires {}", orderCode, userPackage.getExpiredAt());
    }

    public PaymentInfo getPendingPayment(Long elderlyId) {

        UserPackage pending = userPackageRepository
                .findByElderlyProfile_IdAndStatusAndDeletedFalse(elderlyId, PaymentStatus.PENDING)
                .orElseThrow(() -> new NotFoundException("No pending payment found for elderlyId: " + elderlyId));

        return PaymentInfo.builder()
                .checkoutUrl(pending.getCheckoutUrl())
                .amount(pending.getServicePackage().getPrice())
                .description("UP:" + pending.getId())
                .build();
    }

    @lombok.Data
    @lombok.Builder
    public static class PaymentInfo {
        private String checkoutUrl;
        private Double amount;
        private String description;
    }
}