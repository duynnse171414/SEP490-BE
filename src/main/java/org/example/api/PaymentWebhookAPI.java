package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.service.QRPaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@SecurityRequirement(name = "api")
public class PaymentWebhookAPI {

        private final QRPaymentService qrPaymentService;

    @PostMapping("/payos/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody Map<String, Object> payload) {
        try {
            System.out.println("RAW WEBHOOK: " + payload);

            String code = (String) payload.get("code");
            if (!"00".equals(code)) {
                return ResponseEntity.ok("IGNORED");
            }

            Object dataObj = payload.get("data");
            if (!(dataObj instanceof Map)) {
                return ResponseEntity.badRequest().body("Invalid payload");
            }

            Map<String, Object> data = (Map<String, Object>) dataObj;

            // ✅ Dùng orderCode thay vì description
            Long orderCode = ((Number) data.get("orderCode")).longValue();
            Double amount = ((Number) data.get("amount")).doubleValue();

            qrPaymentService.handlePaymentSuccess(orderCode, amount);

            return ResponseEntity.ok("OK");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("ERROR: " + e.getMessage());
        }
    }
    }

