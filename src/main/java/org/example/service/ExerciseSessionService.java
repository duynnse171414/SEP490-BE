package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.model.request.ExerciseSessionRequest;
import org.example.model.response.ExerciseSessionResponse;
import org.example.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseSessionService {
  @Autowired
  ExerciseSessionRepository repository;
  @Autowired
  ExerciseScriptRepository exerciseRepository;
  @Autowired
  ElderlyProfileRepository elderlyRepository;
  @Autowired
     RobotRepository robotRepository;

    // CREATE
    public ExerciseSessionResponse create(ExerciseSessionRequest request) {

        ExerciseScript exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        ElderlyProfile elderly = elderlyRepository.findById(request.getElderlyId())
                .orElseThrow(() -> new RuntimeException("Elderly not found"));

        Robot robot = robotRepository.findById(request.getRobotId())
                .orElseThrow(() -> new RuntimeException("Robot not found"));

        ExerciseSession session = new ExerciseSession();
        session.setExercise(exercise);
        session.setElderly(elderly);
        session.setRobot(robot);
        session.setStartedAt(request.getStartedAt());
        session.setCompletedAt(request.getCompletedAt());
        session.setFeedback(request.getFeedback());
        session.setDeleted(false);

        repository.save(session);

        return mapToResponse(session);
    }

    // GET ALL
    public List<ExerciseSessionResponse> getAll() {
        return repository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public ExerciseSessionResponse getById(Long id) {
        ExerciseSession session = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        return mapToResponse(session);
    }

    // UPDATE
    public ExerciseSessionResponse update(Long id, ExerciseSessionRequest request) {

        ExerciseSession session = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStartedAt(request.getStartedAt());
        session.setCompletedAt(request.getCompletedAt());
        session.setFeedback(request.getFeedback());

        repository.save(session);

        return mapToResponse(session);
    }

    // SOFT DELETE
    public void delete(Long id) {
        ExerciseSession session = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setDeleted(true);
        repository.save(session);
    }

    private ExerciseSessionResponse mapToResponse(ExerciseSession session) {

        ExerciseSessionResponse response = new ExerciseSessionResponse();

        response.setId(session.getId());

        if (session.getExercise() != null) {
            response.setExerciseId(session.getExercise().getId());
            response.setExerciseName(session.getExercise().getName());
        }

        if (session.getElderly() != null) {
            response.setElderlyId(session.getElderly().getId());
            response.setElderlyName(session.getElderly().getAccount().getFullName());
        }

        if (session.getRobot() != null) {
            response.setRobotId(session.getRobot().getId());
            response.setRobotName(session.getRobot().getRobotName());
        }

        response.setStartedAt(session.getStartedAt());
        response.setCompletedAt(session.getCompletedAt());
        response.setFeedback(session.getFeedback());

        return response;
    }
}