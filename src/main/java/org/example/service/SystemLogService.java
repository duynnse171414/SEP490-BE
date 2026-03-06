package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.Account;
import org.example.entity.SystemLog;
import org.example.model.request.SystemLogRequest;
import org.example.model.response.SystemLogResponse;
import org.example.repository.AccountRepository;
import org.example.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SystemLogService {
     @Autowired
     SystemLogRepository systemLogRepository;
     @Autowired
     AccountRepository accountRepository;

    // CREATE
    public SystemLogResponse create(SystemLogRequest request) {

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        SystemLog log = new SystemLog();

        log.setAccount(account);
        log.setAction(request.getAction());
        log.setTargetEntity(request.getTargetEntity());
        log.setCreatedAt(LocalDateTime.now());
        log.setDeleted(false);

        systemLogRepository.save(log);

        return mapToResponse(log);
    }

    // GET ALL
    public List<SystemLogResponse> getAll() {

        return systemLogRepository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public SystemLogResponse getById(Long id) {

        SystemLog log = systemLogRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("System log not found"));

        return mapToResponse(log);
    }

    // UPDATE
    public SystemLogResponse update(Long id, SystemLogRequest request) {

        SystemLog log = systemLogRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("System log not found"));

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        log.setAccount(account);
        log.setAction(request.getAction());
        log.setTargetEntity(request.getTargetEntity());

        systemLogRepository.save(log);

        return mapToResponse(log);
    }

    // SOFT DELETE
    public void delete(Long id) {

        SystemLog log = systemLogRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("System log not found"));

        log.setDeleted(true);

        systemLogRepository.save(log);
    }

    private SystemLogResponse mapToResponse(SystemLog log) {

        SystemLogResponse response = new SystemLogResponse();

        response.setId(log.getId());
        response.setAccountId(log.getAccount().getId());
        response.setAction(log.getAction());
        response.setTargetEntity(log.getTargetEntity());
        response.setCreatedAt(log.getCreatedAt());

        return response;
    }
}