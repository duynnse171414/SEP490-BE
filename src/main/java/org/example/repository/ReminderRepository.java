package org.example.repository;

import org.example.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByDeletedFalse();

    Optional<Reminder> findByIdAndDeletedFalse(Long id);

    List<Reminder> findByElderlyIdAndDeletedFalse(Long elderlyId);

    List<Reminder> findByCaregiverIdAndDeletedFalse(Long caregiverId);

    List<Reminder> findByAccountIdAndDeletedFalse(Long accountId);

    Optional<Reminder> findByIdAndAccountIdAndDeletedFalse(Long id, Long accountId);

}
