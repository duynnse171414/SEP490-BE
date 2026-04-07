package org.example.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@Entity
public class Account implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @Enumerated(EnumType.STRING)
    Role role;


    boolean deleted = false;

    @NotBlank
    String fullName;

    @NotBlank(message = "Gender can not be blank!")
    @Pattern(regexp = "^(Male|Female)$", message = ("Invalid Gender"))
    String gender; // Đổi từ Gender thành gender (lowercase)

    @Email(message = "Invalid Email!")
    @Column(unique = true)
    String email;

    @Pattern(regexp = "(84|0[3|5|7|8|9])+(\\d{8})", message = "Invalid phone!")
    @Column(unique = true)
    String phone;

    @Size(min = 6, message = "Password must be at least 6 character!")
    String password;

    @Column(name = "otp")
    private String otp;

    @Column(name = "otp_expired_at")
    private Long otpExpiredAt;

    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(name = "is_verified")
    private boolean verified = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + role.name().toUpperCase())
        );
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // Override getPassword() method từ UserDetails interface
    @Override
    public String getPassword() {
        return this.password;
    }

    @OneToMany(mappedBy = "account")
    private List<ElderlyProfile> elderlyProfiles;

    @OneToMany(mappedBy = "account")
    private List<CaregiverProfile> caregiverProfiles;



}