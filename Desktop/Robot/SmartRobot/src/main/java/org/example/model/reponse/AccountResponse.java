package org.example.model.reponse;

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
    LocalDateTime createdAt;
}
