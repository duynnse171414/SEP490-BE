package org.example.repository;

import org.example.entity.AlertNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlertNotificationRepository extends JpaRepository<AlertNotification, Long> {

    List<AlertNotification> findByDeletedFalse();

    Optional<AlertNotification> findByIdAndDeletedFalse(Long id);

    List<AlertNotification> findByElderlyIdAndDeletedFalse(Long elderlyId);
}