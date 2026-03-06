package org.example.repository;

import org.example.entity.ElderlyProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ElderlyProfileRepository extends JpaRepository<ElderlyProfile, Long> {

    List<ElderlyProfile> findByDeletedFalse();

    Optional<ElderlyProfile> findByIdAndDeletedFalse(Long id);
}