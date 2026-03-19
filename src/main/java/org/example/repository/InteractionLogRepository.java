package org.example.repository;

import org.example.entity.InteractionLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InteractionLogRepository extends JpaRepository<InteractionLog, Long> {

    List<InteractionLog> findByDeletedFalse();

    Optional<InteractionLog> findByIdAndDeletedFalse(Long id);

    List<InteractionLog> findByElderlyIdAndDeletedFalse(Long elderlyId);

    List<InteractionLog> findByRobotIdAndDeletedFalse(Long robotId);
}