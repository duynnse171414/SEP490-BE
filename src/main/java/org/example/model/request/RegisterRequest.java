package org.example.model.request;

import org.example.entity.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class RegisterRequest {
    @NotBlank
    String fullName;

    String gender;

    String email;

    String phone;

    String password;


    @Enumerated(EnumType.STRING)
    Role role;
}
