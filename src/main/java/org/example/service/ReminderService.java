package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.exception.NotFoundException;
import org.example.model.request.ReminderRequest;
import org.example.model.response.ReminderResponse;
import org.example.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    ModelMapper modelMapper;

    // CREATE
    public ReminderResponse create(ReminderRequest request) {

        ElderlyProfile elderly = elderlyRepository.findById(request.getElderlyId())
                .orElseThrow(() -> new RuntimeException("Elderly not found"));

        CaregiverProfile caregiver = caregiverRepository.findById(request.getCaregiverId())
                .orElseThrow(() -> new RuntimeException("Caregiver not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Account account = accountRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Reminder reminder = new Reminder();
        reminder.setElderly(elderly);
        reminder.setCaregiver(caregiver);
        reminder.setAccount(account);

        reminder.setTitle(request.getTitle());
        reminder.setReminderType(request.getReminderType());

        // ✅ AUTO SET GIỜ VIỆT NAM
        if (request.getScheduleTime() == null) {
            throw new RuntimeException("scheduleTime is required");
        }

// nếu FE gửi đúng giờ VN thì set luôn
        reminder.setScheduleTime(request.getScheduleTime());

        reminder.setRepeatPattern(request.getRepeatPattern());
        reminder.setActive(request.getActive() != null ? request.getActive() : true);
        reminder.setDeleted(false);

        repository.save(reminder);

        return mapToResponse(reminder);
    }

    // GET ALL
    public List<ReminderResponse> getAll() {

        // 🔥 LẤY USER ĐANG LOGIN
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Account account = accountRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // ✅ CHỈ LẤY REMINDER CỦA ACCOUNT NÀY
        return repository.findByAccountIdAndDeletedFalse(account.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public ReminderResponse getById(Long id) {

        // 🔥 LẤY USER ĐANG LOGIN
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Account account = accountRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // ✅ CHỈ LẤY REMINDER CỦA ACCOUNT NÀY
        Reminder reminder = repository.findByIdAndAccountIdAndDeletedFalse(id, account.getId())
                .orElseThrow(() -> new RuntimeException("Reminder not found or access denied"));

        return mapToResponse(reminder);
    }

    // UPDATE
    public ReminderResponse update(Long id, ReminderRequest request) {

        Reminder reminder = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));

        reminder.setTitle(request.getTitle());
        reminder.setReminderType(request.getReminderType());
        if (request.getScheduleTime() == null) {
            throw new RuntimeException("scheduleTime is required");
        }

// nếu FE gửi đúng giờ VN thì set luôn
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
            response.setElderlyName(reminder.getElderly().getName());
        }

        if (reminder.getCaregiver() != null) {
            response.setCaregiverId(reminder.getCaregiver().getId());
            response.setCaregiverName(reminder.getCaregiver().getRelationship());
        }

        return response;
    }

    // GET BY CAREGIVER ID
    public List<ReminderResponse> getByCaregiverId(Long caregiverId) {
        return repository.findByCaregiverIdAndDeletedFalse(caregiverId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ELDERLY ID
    public List<ReminderResponse> getByElderlyId(Long elderlyId) {
        return repository.findByElderlyIdAndDeletedFalse(elderlyId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReminderResponse> getByAccount(Long accountId) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new NotFoundException("Account not found"));


        return repository.findByAccountIdAndDeletedFalse(accountId)
                .stream()
                .map(profile -> {
                    ReminderResponse response =
                            modelMapper.map(profile, ReminderResponse.class);
                    response.setAccountId(profile.getAccount().getId());
                    return response;
                })
                .collect(Collectors.toList());
    }

    private LocalDateTime convertUtcToVN(String utcTimeStr) {
        Instant instant = Instant.parse(utcTimeStr);

        return instant
                .atZone(ZoneId.of("Asia/Ho_Chi_Minh"))
                .toLocalDateTime();
    }
}