package org.example.repository;

import org.example.entity.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {

    List<SystemLog> findByDeletedFalse();

    Optional<SystemLog> findByIdAndDeletedFalse(Long id);

}