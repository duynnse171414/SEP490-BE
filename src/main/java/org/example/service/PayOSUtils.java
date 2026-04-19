package org.example.service;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Map;

public class PayOSUtils {

    public static boolean verifySignature(Map<String, Object> data,
                                          String signature,
                                          String key) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String rawData = mapper.writeValueAsString(data);

            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey =
                    new SecretKeySpec(key.getBytes(), "HmacSHA256");

            mac.init(secretKey);

            byte[] hash = mac.doFinal(rawData.getBytes());

            String expected = Base64.getEncoder().encodeToString(hash);

            return expected.equals(signature);

        } catch (Exception e) {
            return false;
        }
    }
}