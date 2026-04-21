package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.entity.Account;
import org.example.entity.PaymentStatus;
import org.example.entity.ServicePackage;
import org.example.entity.UserPackage;
import org.example.model.response.UserPackageResponse;
import org.example.repository.ServicePackageRepository;
import org.example.service.QRPaymentService;
import org.example.service.UserPackageService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@SecurityRequirement(name = "api")
public class PaymentAPI {

    private final QRPaymentService qrPaymentService;
    private final ServicePackageRepository servicePackageRepository;
    private final UserPackageService userPackageService;


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




    // ✅ Manager xem tất cả package đã mua
    @GetMapping("/manager/pending")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public List<UserPackageResponse> getPending() {
        return userPackageService.getByStatus(PaymentStatus.PENDING);
    }

    // ✅ Manager xem theo elderly
    @GetMapping("/manager/elderly/{accountId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public List<UserPackageResponse> getByAccount(@PathVariable Long accountId) {
        return userPackageService.getByElderlyId(accountId);
    }
}