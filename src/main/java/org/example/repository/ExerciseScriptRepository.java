package org.example.repository;

import org.example.entity.ExerciseLevel;
import org.example.entity.ExerciseScript;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExerciseScriptRepository extends JpaRepository<ExerciseScript, Long> {

    List<ExerciseScript> findByDeletedFalse();

    Optional<ExerciseScript> findByIdAndDeletedFalse(Long id);

    List<ExerciseScript> findByLevelAndDeletedFalse(ExerciseLevel level);
}