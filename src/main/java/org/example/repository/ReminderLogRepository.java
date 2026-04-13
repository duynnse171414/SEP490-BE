package org.example.repository;

import org.example.entity.ReminderLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReminderLogRepository extends JpaRepository<ReminderLog, Long> {

    List<ReminderLog> findByDeletedFalse();

    Optional<ReminderLog> findByIdAndDeletedFalse(Long id);

    List<ReminderLog> findByElderlyIdAndDeletedFalse(Long elderlyId);

    List<ReminderLog> findByReminderIdAndDeletedFalse(Long reminderId);


}
