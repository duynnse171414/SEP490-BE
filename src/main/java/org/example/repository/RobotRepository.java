package org.example.repository;

import org.example.entity.Robot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RobotRepository extends JpaRepository<Robot, Long> {

    List<Robot> findByDeletedFalse();

    Optional<Robot> findByIdAndDeletedFalse(Long id);


}
