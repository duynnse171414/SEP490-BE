package org.example.model.request;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PayOSRequest {
    private long orderCode;
    private int amount;
    private String description;
    private String returnUrl;
    private String cancelUrl;
}
