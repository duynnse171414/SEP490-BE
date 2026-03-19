package org.example.repository;

import org.example.entity.RobotStatusLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RobotStatusLogRepository extends JpaRepository<RobotStatusLog, Long> {

    List<RobotStatusLog> findByDeletedFalse();

    Optional<RobotStatusLog> findByIdAndDeletedFalse(Long id);

    List<RobotStatusLog> findByRobotIdAndDeletedFalse(Long robotId);

    List<RobotStatusLog> findByRobotIdAndDeletedFalseOrderByReportedAtDesc(Long robotId);
}