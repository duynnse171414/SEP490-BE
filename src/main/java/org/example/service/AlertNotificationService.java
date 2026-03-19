package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.AlertNotification;
import org.example.entity.ElderlyProfile;
import org.example.model.request.AlertNotificationRequest;
import org.example.model.response.AlertNotificationResponse;
import org.example.repository.AlertNotificationRepository;
import org.example.repository.ElderlyProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertNotificationService {
    @Autowired
    AlertNotificationRepository repository;

    @Autowired
    ElderlyProfileRepository elderlyRepository;

    // CREATE
    public AlertNotificationResponse create(AlertNotificationRequest request) {

        ElderlyProfile elderly = elderlyRepository.findById(request.getElderlyId())
                .orElseThrow(() -> new RuntimeException("Elderly not found"));

        AlertNotification alert = new AlertNotification();
        alert.setElderly(elderly);
        alert.setAlertType(request.getAlertType());
        alert.setMessage(request.getMessage());
        alert.setResolved(false);
        alert.setDeleted(false);
        alert.setCreatedAt(LocalDateTime.now());

        repository.save(alert);

        return mapToResponse(alert);
    }

    // GET ALL
    public List<AlertNotificationResponse> getAll() {
        return repository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public AlertNotificationResponse getById(Long id) {
        AlertNotification alert = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        return mapToResponse(alert);
    }

    // UPDATE (chỉ cho update resolved)
    public AlertNotificationResponse update(Long id, AlertNotificationRequest request) {

        AlertNotification alert = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        if (request.getResolved() != null) {
            alert.setResolved(request.getResolved());
        }

        repository.save(alert);

        return mapToResponse(alert);
    }

    // SOFT DELETE
    public void delete(Long id) {
        AlertNotification alert = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        alert.setDeleted(true);
        repository.save(alert);
    }

    private AlertNotificationResponse mapToResponse(AlertNotification alert) {

        AlertNotificationResponse response = new AlertNotificationResponse();

        response.setId(alert.getId());
        response.setAlertType(alert.getAlertType());
        response.setMessage(alert.getMessage());
        response.setResolved(alert.isResolved());
        response.setCreatedAt(alert.getCreatedAt());

        if (alert.getElderly() != null) {
            response.setElderlyId(alert.getElderly().getId());
            response.setElderlyName(alert.getElderly().getAccount().getFullName());
        }

        return response;
    }
}