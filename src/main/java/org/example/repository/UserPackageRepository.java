package org.example.repository;

import org.example.entity.Account;
import org.example.entity.PaymentStatus;
import org.example.entity.UserPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserPackageRepository extends JpaRepository<UserPackage, Long> {

    List<UserPackage> findByDeletedFalse();

    Optional<UserPackage> findByIdAndDeletedFalse(Long id);

    Optional<UserPackage> findTopByAccountAndDeletedFalseOrderByAssignedAtDesc(Account account);

    boolean existsByServicePackage_IdAndDeletedFalse(Long servicePackageId);

    List<UserPackage> findByElderlyProfileIdAndDeletedFalse(Long elderlyId);

    List<UserPackage> findByStatusAndDeletedFalse(PaymentStatus status);

    @Query("""
SELECT up FROM UserPackage up
WHERE up.account = :account
AND up.deleted = false
AND (up.expiredAt IS NULL OR up.expiredAt > CURRENT_TIMESTAMP)
ORDER BY up.assignedAt DESC
""")
    Optional<UserPackage> findActivePackage(Account account);
}