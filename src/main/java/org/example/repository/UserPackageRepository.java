package org.example.repository;

import org.example.entity.Account;
import org.example.entity.PaymentStatus;
import org.example.entity.UserPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserPackageRepository extends JpaRepository<UserPackage, Long> {

    List<UserPackage> findByDeletedFalse();

    Optional<UserPackage> findByIdAndDeletedFalse(Long id);

    List<UserPackage> findByElderlyProfileIdAndDeletedFalse(Long elderlyId);

    List<UserPackage> findByStatusAndDeletedFalse(PaymentStatus status);

    boolean existsByElderlyProfile_IdAndStatusAndDeletedFalse(Long elderlyId, PaymentStatus status);

    Optional<UserPackage> findFirstByElderlyProfileIdAndStatusAndExpiredAtAfterAndDeletedFalseOrderByExpiredAtDesc(
            Long elderlyProfileId, PaymentStatus status, LocalDateTime now);

    Optional<UserPackage> findByElderlyProfile_IdAndStatusAndDeletedFalse(Long elderlyProfileId, PaymentStatus status);

}