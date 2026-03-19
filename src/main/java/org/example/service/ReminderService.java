package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.model.request.ReminderRequest;
import org.example.model.response.ReminderResponse;
import org.example.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReminderService {
    @Autowired
    ReminderRepository repository;
    @Autowired
    ElderlyProfileRepository elderlyRepository;
    @Autowired
    CaregiverProfileRepository caregiverRepository;

    // CREATE
    public ReminderResponse create(ReminderRequest request) {

        ElderlyProfile elderly = elderlyRepository.findById(request.getElderlyId())
                .orElseThrow(() -> new RuntimeException("Elderly not found"));

        CaregiverProfile caregiver = caregiverRepository.findById(request.getCaregiverId())
                .orElseThrow(() -> new RuntimeException("Caregiver not found"));

        Reminder reminder = new Reminder();
        reminder.setElderly(elderly);
        reminder.setCaregiver(caregiver);
        reminder.setTitle(request.getTitle());
        reminder.setReminderType(request.getReminderType());
        reminder.setScheduleTime(request.getScheduleTime());
        reminder.setRepeatPattern(request.getRepeatPattern());
        reminder.setActive(request.getActive() != null ? request.getActive() : true);
        reminder.setDeleted(false);

        repository.save(reminder);

        return mapToResponse(reminder);
    }

    // GET ALL
    public List<ReminderResponse> getAll() {
        return repository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public ReminderResponse getById(Long id) {
        Reminder reminder = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));

        return mapToResponse(reminder);
    }

    // UPDATE
    public ReminderResponse update(Long id, ReminderRequest request) {

        Reminder reminder = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));

        reminder.setTitle(request.getTitle());
        reminder.setReminderType(request.getReminderType());
        reminder.setScheduleTime(request.getScheduleTime());
        reminder.setRepeatPattern(request.getRepeatPattern());

        if (request.getActive() != null) {
            reminder.setActive(request.getActive());
        }

        repository.save(reminder);

        return mapToResponse(reminder);
    }

    // SOFT DELETE
    public void delete(Long id) {

        Reminder reminder = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));

        reminder.setDeleted(true);
        repository.save(reminder);
    }

    private ReminderResponse mapToResponse(Reminder reminder) {

        ReminderResponse response = new ReminderResponse();

        response.setId(reminder.getId());
        response.setTitle(reminder.getTitle());
        response.setReminderType(reminder.getReminderType());
        response.setScheduleTime(reminder.getScheduleTime());
        response.setRepeatPattern(reminder.getRepeatPattern());
        response.setActive(reminder.isActive());

        if (reminder.getElderly() != null) {
            response.setElderlyId(reminder.getElderly().getId());
            response.setElderlyName(reminder.getElderly().getAccount().getFullName());
        }

        if (reminder.getCaregiver() != null) {
            response.setCaregiverId(reminder.getCaregiver().getId());
            response.setCaregiverName(reminder.getCaregiver().getRelationship());
        }

        return response;
    }
}