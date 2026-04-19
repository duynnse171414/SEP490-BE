package org.example.repository;

import org.example.entity.RobotAction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RobotActionRepository extends JpaRepository<RobotAction, Long> {
    Optional<RobotAction> findTopByExecutedFalseOrderByIdDesc();
}