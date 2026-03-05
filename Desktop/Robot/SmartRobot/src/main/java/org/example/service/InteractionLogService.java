package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.model.request.InteractionLogRequest;
import org.example.model.response.InteractionLogResponse;
import org.example.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InteractionLogService {
     @Autowired
     InteractionLogRepository repository;
     @Autowired
     ElderlyProfileRepository elderlyRepository;
     @Autowired
     RobotRepository robotRepository;

    // CREATE
    public InteractionLogResponse create(InteractionLogRequest request) {

        ElderlyProfile elderly = elderlyRepository.findById(request.getElderlyId())
                .orElseThrow(() -> new RuntimeException("Elderly not found"));

        Robot robot = robotRepository.findById(request.getRobotId())
                .orElseThrow(() -> new RuntimeException("Robot not found"));

        InteractionLog log = new InteractionLog();
        log.setElderly(elderly);
        log.setRobot(robot);
        log.setInteractionType(request.getInteractionType());
        log.setUserInputText(request.getUserInputText());
        log.setRobotResponseText(request.getRobotResponseText());
        log.setEmotionDetected(request.getEmotionDetected());
        log.setCreatedAt(LocalDateTime.now());
        log.setDeleted(false);

        repository.save(log);

        return mapToResponse(log);
    }

    // GET ALL
    public List<InteractionLogResponse> getAll() {
        return repository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public InteractionLogResponse getById(Long id) {
        InteractionLog log = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Log not found"));

        return mapToResponse(log);
    }

    // UPDATE (chỉ cho update emotion nếu cần)
    public InteractionLogResponse updateEmotion(Long id, String emotion) {

        InteractionLog log = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Log not found"));

        log.setEmotionDetected(emotion);
        repository.save(log);

        return mapToResponse(log);
    }

    // SOFT DELETE
    public void delete(Long id) {

        InteractionLog log = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Log not found"));

        log.setDeleted(true);
        repository.save(log);
    }

    private InteractionLogResponse mapToResponse(InteractionLog log) {

        InteractionLogResponse response = new InteractionLogResponse();

        response.setId(log.getId());
        response.setInteractionType(log.getInteractionType());
        response.setUserInputText(log.getUserInputText());
        response.setRobotResponseText(log.getRobotResponseText());
        response.setEmotionDetected(log.getEmotionDetected());
        response.setCreatedAt(log.getCreatedAt());

        if (log.getElderly() != null) {
            response.setElderlyId(log.getElderly().getId());
            response.setElderlyName(log.getElderly().getAccount().getFullName());
        }

        if (log.getRobot() != null) {
            response.setRobotId(log.getRobot().getId());
            response.setRobotName(log.getRobot().getRobotName());
        }

        return response;
    }
}
