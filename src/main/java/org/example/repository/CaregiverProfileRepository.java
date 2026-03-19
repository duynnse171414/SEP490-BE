package org.example.repository;

import org.example.entity.CaregiverProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CaregiverProfileRepository extends JpaRepository<CaregiverProfile, Long> {

    List<CaregiverProfile> findByDeletedFalse();

    Optional<CaregiverProfile> findByIdAndDeletedFalse(Long id);

    boolean existsByAccountId(Long accountId);
}
