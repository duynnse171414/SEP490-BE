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
import java.util.*;

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
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("orderCode", request.getOrderCode()); // phải là long/int
            body.put("amount", request.getAmount());       // phải là int (VND)
            body.put("description", request.getDescription()); // tối đa 25 ký tự
            body.put("returnUrl", request.getReturnUrl());
            body.put("cancelUrl", request.getCancelUrl());

            // ✅ Tạo signature đúng chuẩn PayOS
            String signature = buildSignature(body);
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

            if (response.getBody() == null) {
                throw new RuntimeException("Empty response from PayOS");
            }

            Map data = (Map) response.getBody().get("data");
            if (data == null) {
                throw new RuntimeException("PayOS response missing 'data': " + response.getBody());
            }

            return (String) data.get("checkoutUrl");

        } catch (Exception e) {
            throw new RuntimeException("Create PayOS payment failed: " + e.getMessage(), e);
        }
    }

    /**
     * ✅ Đúng chuẩn PayOS:
     * Sắp xếp key theo alphabet → nối thành "key1=val1&key2=val2" → HMAC-SHA256 → HEX
     */
    private String buildSignature(Map<String, Object> data) {
        // Chỉ lấy các field PayOS yêu cầu ký
        List<String> keys = Arrays.asList("amount", "cancelUrl", "description", "orderCode", "returnUrl");
        Collections.sort(keys); // sắp xếp alphabet

        StringBuilder sb = new StringBuilder();
        for (String key : keys) {
            if (data.containsKey(key)) {
                if (sb.length() > 0) sb.append("&");
                sb.append(key).append("=").append(data.get(key));
            }
        }

        return hmacSHA256Hex(sb.toString(), checksumKey);
    }

    /**
     * ✅ HMAC-SHA256 trả về HEX (không phải Base64)
     */
    private String hmacSHA256Hex(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA256");
            mac.init(secretKey);

            byte[] hash = mac.doFinal(data.getBytes("UTF-8"));

            // ✅ convert sang HEX
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();

        } catch (Exception e) {
            throw new RuntimeException("Signature error", e);
        }
    }
}