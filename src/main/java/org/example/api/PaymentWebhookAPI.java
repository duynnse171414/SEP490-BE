package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.service.QRPaymentService;
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
    public String handleWebhook(@RequestBody Map<String, Object> payload) {

        try {
            System.out.println("RAW WEBHOOK: " + payload);

            String code = (String) payload.get("code");

            // ❗ check success trước
            if (!"00".equals(code)) {
                return "IGNORED";
            }

            Object dataObj = payload.get("data");

            // ❗ tránh null
            if (!(dataObj instanceof Map)) {
                throw new RuntimeException("Invalid payload: data is null");
            }

            Map<String, Object> data = (Map<String, Object>) dataObj;

            String description = (String) data.get("description");
            Double amount = ((Number) data.get("amount")).doubleValue();

            qrPaymentService.handlePaymentSuccess(description, amount);

            return "OK";

        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR";
        }
    }
    }

