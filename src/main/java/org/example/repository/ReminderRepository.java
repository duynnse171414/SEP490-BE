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

    List<Reminder> findByCaregiverIdAndDeletedFalse(Long caregiverId);

    List<Reminder> findByAccountIdAndDeletedFalse(Long accountId);

    Optional<Reminder> findByIdAndAccountIdAndDeletedFalse(Long id, Long accountId);

    long countByElderlyIdAndDeletedFalse(Long elderlyId);

    // Tìm reminder đã deleted có cùng elderly + title + scheduleTime
    Optional<Reminder> findByElderlyIdAndTitleAndScheduleTimeAndDeletedTrue(
            Long elderlyId, String title, LocalDateTime scheduleTime);

    // Lấy danh sách reminder đã deleted của account (cho UI khôi phục)
    List<Reminder> findByAccountIdAndDeletedTrue(Long accountId);

    // Tìm theo id kèm account check (cho restore)
    Optional<Reminder> findByIdAndAccountId(Long id, Long accountId);

    // ReminderRepository

    // Danh sách đang chạy (màn hình chính)
    List<Reminder> findByAccountIdAndActiveTrueAndDeletedFalse(Long accountId);


}
