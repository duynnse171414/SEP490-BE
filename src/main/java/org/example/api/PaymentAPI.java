package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.entity.Account;
import org.example.entity.ServicePackage;
import org.example.repository.ServicePackageRepository;
import org.example.service.QRPaymentService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@SecurityRequirement(name = "api")
public class PaymentAPI {

    private final QRPaymentService qrPaymentService;
    private final ServicePackageRepository servicePackageRepository;

    // ===================== CREATE PAYMENT =====================
    @PostMapping("/create/{servicePackageId}")
    public QRPaymentService.PaymentInfo createPayment(
            @PathVariable Long servicePackageId,
            @RequestParam Long elderlyProfileId,   // ✅ thêm dòng này
            @AuthenticationPrincipal Account account
    ) {
        ServicePackage servicePackage = servicePackageRepository.findById(servicePackageId)
                .orElseThrow(() -> new RuntimeException("ServicePackage not found"));

        return qrPaymentService.createPayment(account, servicePackage, elderlyProfileId);
    }

    // ===================== CONFIRM PAYMENT =====================
    @PostMapping("/confirm")
    public String confirmPayment(
            @RequestParam String description,
            @RequestParam Double amount
    ) {
        qrPaymentService.handlePaymentSuccess(description, amount);
        return "Payment confirmed & package created";
    }
}