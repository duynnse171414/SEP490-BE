package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.service.QRPaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
@Slf4j
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@SecurityRequirement(name = "api")
public class PaymentWebhookAPI {

    private final QRPaymentService qrPaymentService;

    @PostMapping("/payos/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody Map<String, Object> payload) {
        log.info("Received PayOS webhook: {}", payload);

        try {
            String code = (String) payload.get("code");
            if (!"00".equals(code)) {
                log.info("Webhook code != 00, ignored. code={}", code);
                return ResponseEntity.ok("IGNORED");
            }

            Object dataObj = payload.get("data");
            if (!(dataObj instanceof Map<?, ?> data)) {
                log.warn("Webhook payload missing 'data' object");
                return ResponseEntity.badRequest().body("INVALID_PAYLOAD");
            }

            Object orderCodeRaw = data.get("orderCode");
            Object amountRaw = data.get("amount");
            if (!(orderCodeRaw instanceof Number) || !(amountRaw instanceof Number)) {
                log.warn("Webhook missing orderCode/amount: {}", data);
                return ResponseEntity.badRequest().body("INVALID_PAYLOAD");
            }

            Long orderCode = ((Number) orderCodeRaw).longValue();
            Double amount = ((Number) amountRaw).doubleValue();

            qrPaymentService.handlePaymentSuccess(orderCode, amount);

            return ResponseEntity.ok("OK");

        } catch (Exception e) {
            log.error("Error processing PayOS webhook", e);
            return ResponseEntity.status(500).body("ERROR");
        }
    }
}