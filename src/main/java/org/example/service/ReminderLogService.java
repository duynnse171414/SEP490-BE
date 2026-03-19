package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.model.request.ReminderLogRequest;
import org.example.model.response.ReminderLogResponse;
import org.example.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReminderLogService {
    @Autowired
    ReminderLogRepository repository;
    @Autowired
    ReminderRepository reminderRepository;
    @Autowired
    RobotRepository robotRepository;
    @Autowired
    ElderlyProfileRepository elderlyRepository;

    // CREATE (robot triggered reminder)
    public ReminderLogResponse create(ReminderLogRequest request) {

        Reminder reminder = reminderRepository.findById(request.getReminderId())
                .orElseThrow(() -> new RuntimeException("Reminder not found"));

        Robot robot = robotRepository.findById(request.getRobotId())
                .orElseThrow(() -> new RuntimeException("Robot not found"));

        ElderlyProfile elderly = elderlyRepository.findById(request.getElderlyId())
                .orElseThrow(() -> new RuntimeException("Elderly not found"));

        ReminderLog log = new ReminderLog();
        log.setReminder(reminder);
        log.setRobot(robot);
        log.setElderly(elderly);
        log.setTriggeredTime(LocalDateTime.now());
        log.setConfirmed(false);
        log.setDeleted(false);

        repository.save(log);

        return mapToResponse(log);
    }

    // CONFIRM reminder
    public ReminderLogResponse confirm(Long id) {

        ReminderLog log = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Reminder log not found"));

        log.setConfirmed(true);
        log.setConfirmedTime(LocalDateTime.now());

        repository.save(log);

        return mapToResponse(log);
    }

    // GET ALL
    public List<ReminderLogResponse> getAll() {
        return repository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public ReminderLogResponse getById(Long id) {
        ReminderLog log = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Reminder log not found"));

        return mapToResponse(log);
    }

    // SOFT DELETE
    public void delete(Long id) {

        ReminderLog log = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Reminder log not found"));

        log.setDeleted(true);
        repository.save(log);
    }

    private ReminderLogResponse mapToResponse(ReminderLog log) {

        ReminderLogResponse response = new ReminderLogResponse();

        response.setId(log.getId());
        response.setTriggeredTime(log.getTriggeredTime());
        response.setConfirmed(log.isConfirmed());
        response.setConfirmedTime(log.getConfirmedTime());

        if (log.getReminder() != null) {
            response.setReminderId(log.getReminder().getId());
            response.setReminderTitle(log.getReminder().getTitle());
        }

        if (log.getRobot() != null) {
            response.setRobotId(log.getRobot().getId());
            response.setRobotName(log.getRobot().getRobotName());
        }

        if (log.getElderly() != null) {
            response.setElderlyId(log.getElderly().getId());
            response.setElderlyName(log.getElderly().getAccount().getFullName());
        }

        return response;
    }
}
