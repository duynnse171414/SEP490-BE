package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.entity.UserPackage;
import org.example.repository.UserPackageRepository;
import org.example.service.QRPaymentService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@SecurityRequirement(name = "api")
public class PaymentAPI {

    private final QRPaymentService qrPaymentService;
    private final UserPackageRepository userPackageRepository;

    // ===================== CREATE PAYMENT =====================
    @PostMapping("/user-package/{id}")
    public QRPaymentService.PaymentInfo createPayment(@PathVariable Long id) {

        UserPackage userPackage = userPackageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserPackage not found"));

        // tránh thanh toán lại
        if (userPackage.getAssignedAt() != null) {
            throw new RuntimeException("Package already activated");
        }

        Double amount = userPackage.getServicePackage().getPrice();

        return qrPaymentService.createPayment(userPackage, amount);
    }

}
