package org.example.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.model.request.PayOSRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PayOSService {

    @Value("${payos.client-id}")
    private String clientId;

    @Value("${payos.api-key}")
    private String apiKey;

    @Value("${payos.checksum-key}")
    private String checksumKey;

    @Value("${payos.endpoint}")
    private String endpoint;

    private final RestTemplate restTemplate = new RestTemplate();

    public String createPaymentLink(PayOSRequest request) {
        try {
            ObjectMapper mapper = new ObjectMapper();

            Map<String, Object> body = new HashMap<>();
            body.put("orderCode", request.getOrderCode());
            body.put("amount", request.getAmount());
            body.put("description", request.getDescription());
            body.put("returnUrl", request.getReturnUrl());
            body.put("cancelUrl", request.getCancelUrl());

            // 🔐 tạo signature
            String rawData = mapper.writeValueAsString(body);
            String signature = sign(rawData, checksumKey);

            body.put("signature", signature);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-client-id", clientId);
            headers.set("x-api-key", apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    endpoint,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            Map data = (Map) response.getBody().get("data");

            return (String) data.get("checkoutUrl");

        } catch (Exception e) {
            throw new RuntimeException("Create PayOS payment failed", e);
        }
    }

    private String sign(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            mac.init(secretKey);

            byte[] hash = mac.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(hash);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}