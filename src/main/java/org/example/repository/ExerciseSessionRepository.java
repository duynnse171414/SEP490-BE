package org.example.repository;

import org.example.entity.ExerciseSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExerciseSessionRepository extends JpaRepository<ExerciseSession, Long> {

    List<ExerciseSession> findByDeletedFalse();

    Optional<ExerciseSession> findByIdAndDeletedFalse(Long id);

    List<ExerciseSession> findByElderlyIdAndDeletedFalse(Long elderlyId);
}