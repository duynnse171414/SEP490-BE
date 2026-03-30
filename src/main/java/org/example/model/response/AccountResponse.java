package org.example.model.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AccountResponse {
    long id;
    String FullName;
    String Gender;
    String email;
    String phone;
    String token;
    String status;
    String message;
    String verified;
    LocalDateTime createdAt;
}
