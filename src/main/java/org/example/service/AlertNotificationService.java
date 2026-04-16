package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.AlertNotification;
import org.example.entity.ElderlyProfile;
import org.example.entity.Reminder;
import org.example.model.request.AlertNotificationRequest;
import org.example.model.response.AlertNotificationResponse;
import org.example.repository.AlertNotificationRepository;
import org.example.repository.ElderlyProfileRepository;
import org.example.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertNotificationService {

    private final AlertNotificationRepository repository;
    private final ElderlyProfileRepository elderlyRepository;
    private final ReminderRepository reminderRepository;

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

        // 👉 NEW: set reminder
        if (request.getReminderId() != null) {
            Reminder reminder = reminderRepository.findById(request.getReminderId())
                    .orElseThrow(() -> new RuntimeException("Reminder not found"));
            alert.setReminder(reminder);
        }

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

    // GET BY ELDERLY
    public List<AlertNotificationResponse> getByElderlyId(Long elderlyId) {

        elderlyRepository.findById(elderlyId)
                .orElseThrow(() -> new RuntimeException("Elderly not found"));

        return repository.findByElderlyIdAndDeletedFalse(elderlyId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AlertNotificationResponse> getByReminderId(Long reminderId) {

        // optional: check reminder tồn tại
        reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));

        return repository.findByReminderIdAndDeletedFalse(reminderId)
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

    // UPDATE (resolved + reminder optional)
    public AlertNotificationResponse update(Long id, AlertNotificationRequest request) {

        AlertNotification alert = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        if (request.getResolved() != null) {
            alert.setResolved(request.getResolved());
        }

        // 👉 update reminder nếu có truyền lên
        if (request.getReminderId() != null) {
            Reminder reminder = reminderRepository.findById(request.getReminderId())
                    .orElseThrow(() -> new RuntimeException("Reminder not found"));
            alert.setReminder(reminder);
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

    // MAPPER
    private AlertNotificationResponse mapToResponse(AlertNotification alert) {

        AlertNotificationResponse response = new AlertNotificationResponse();

        response.setId(alert.getId());
        response.setAlertType(alert.getAlertType());
        response.setMessage(alert.getMessage());
        response.setResolved(alert.isResolved());
        response.setCreatedAt(alert.getCreatedAt());

        // Elderly
        if (alert.getElderly() != null) {
            response.setElderlyId(alert.getElderly().getId());
            response.setElderlyName(alert.getElderly().getName());
        }

        // 👉 NEW: Reminder mapping
        if (alert.getReminder() != null) {
            response.setReminderId(alert.getReminder().getId());
        }

        return response;
    }
}