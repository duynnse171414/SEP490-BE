package org.example.repository;

import org.example.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByDeletedFalse();

    Optional<Reminder> findByIdAndDeletedFalse(Long id);

    List<Reminder> findByElderlyIdAndDeletedFalse(Long elderlyId);

    List<Reminder> findByAccountIdAndDeletedFalse(Long accountId);

    Optional<Reminder> findByIdAndAccountIdAndDeletedFalse(Long id, Long accountId);

    long countByElderlyIdAndDeletedFalse(Long elderlyId);

    Optional<Reminder> findByElderlyIdAndTitleAndScheduleTimeAndDeletedTrue(
            Long elderlyId, String title, LocalDateTime scheduleTime);

    List<Reminder> findByAccountIdAndDeletedTrue(Long accountId);

    Optional<Reminder> findByIdAndAccountId(Long id, Long accountId);

    List<Reminder> findByElderlyIdAndAccountIdAndDeletedFalse(Long elderlyId, Long accountId);



}
