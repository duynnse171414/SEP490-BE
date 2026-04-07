package org.example.model.request;

import lombok.Data;
import org.example.entity.Role;

@Data
public class UpdateAccountRequest {

    private String fullName;

    private String phone;

    private String gender;

    private String password;

    private Role role;

    private Boolean deleted;
}