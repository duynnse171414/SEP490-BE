package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.Robot;
import org.example.entity.RobotStatusLog;
import org.example.model.request.RobotStatusLogRequest;
import org.example.model.response.RobotStatusLogResponse;
import org.example.repository.RobotRepository;
import org.example.repository.RobotStatusLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RobotStatusLogService {
    @Autowired
    RobotStatusLogRepository repository;
    @Autowired
    RobotRepository robotRepository;

    // CREATE
    public RobotStatusLogResponse create(RobotStatusLogRequest request) {

        Robot robot = robotRepository.findById(request.getRobotId())
                .orElseThrow(() -> new RuntimeException("Robot not found"));

        RobotStatusLog log = new RobotStatusLog();
        log.setRobot(robot);
        log.setStatus(request.getStatus());
        log.setReportedAt(LocalDateTime.now());
        log.setDeleted(false);

        repository.save(log);

        return mapToResponse(log);
    }

    // GET ALL
    public List<RobotStatusLogResponse> getAll() {
        return repository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ROBOT
    public List<RobotStatusLogResponse> getByRobot(Long robotId) {
        return repository
                .findByRobotIdAndDeletedFalseOrderByReportedAtDesc(robotId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public RobotStatusLogResponse getById(Long id) {

        RobotStatusLog log = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Status log not found"));

        return mapToResponse(log);
    }

    // SOFT DELETE
    public void delete(Long id) {

        RobotStatusLog log = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Status log not found"));

        log.setDeleted(true);
        repository.save(log);
    }

    private RobotStatusLogResponse mapToResponse(RobotStatusLog log) {

        RobotStatusLogResponse response = new RobotStatusLogResponse();

        response.setId(log.getId());
        response.setStatus(log.getStatus());
        response.setReportedAt(log.getReportedAt());

        if (log.getRobot() != null) {
            response.setRobotId(log.getRobot().getId());
            response.setRobotName(log.getRobot().getRobotName());
        }

        return response;
    }
}