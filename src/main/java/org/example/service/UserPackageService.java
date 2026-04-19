package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.model.request.UserPackageRequest;
import org.example.model.response.UserPackageResponse;
import org.example.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserPackageService {

    private final UserPackageRepository userPackageRepository;
    private final AccountRepository accountRepository;
    private final ServicePackageRepository servicePackageRepository;
    private final ElderlyProfileRepository elderlyProfileRepository;


    // ================= CREATE =================
    public UserPackageResponse create(UserPackageRequest request) {

        Account account = getAccount(request.getAccountId());
        ServicePackage servicePackage = getServicePackage(request.getServicePackageId());
        ElderlyProfile elderly = getElderly(request.getElderlyProfileId());

        UserPackage userPackage = new UserPackage();
        userPackage.setAccount(account);
        userPackage.setServicePackage(servicePackage);
        userPackage.setElderlyProfile(elderly);
        userPackage.setDeleted(false);

        userPackageRepository.save(userPackage);

        return mapToResponse(userPackage);
    }

    // ================= GET ALL =================
    public List<UserPackageResponse> getAll() {
        return userPackageRepository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ================= GET BY ID =================
    public UserPackageResponse getById(Long id) {
        return mapToResponse(getUserPackage(id));
    }

    // ================= GET BY ELDERLY =================
    public List<UserPackageResponse> getByElderlyId(Long elderlyId) {

        // validate tồn tại
        getElderly(elderlyId);

        return userPackageRepository
                .findByElderlyProfileIdAndDeletedFalse(elderlyId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<UserPackageResponse> getByStatus(PaymentStatus status) {
        return userPackageRepository.findByStatusAndDeletedFalse(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ================= UPDATE =================
    public UserPackageResponse update(Long id, UserPackageRequest request) {

        UserPackage userPackage = getUserPackage(id);

        Account account = getAccount(request.getAccountId());
        ServicePackage servicePackage = getServicePackage(request.getServicePackageId());
        ElderlyProfile elderly = getElderly(request.getElderlyProfileId());

        userPackage.setAccount(account);
        userPackage.setServicePackage(servicePackage);
        userPackage.setElderlyProfile(elderly);

        userPackageRepository.save(userPackage);

        return mapToResponse(userPackage);
    }

    // ================= DELETE =================
    public void delete(Long id) {

        UserPackage userPackage = getUserPackage(id);
        userPackage.setDeleted(true);

        userPackageRepository.save(userPackage);
    }

    // ================= PRIVATE HELPER =================
    private UserPackage getUserPackage(Long id) {
        return userPackageRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("UserPackage not found"));
    }

    private Account getAccount(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    private ServicePackage getServicePackage(Long id) {
        return servicePackageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service package not found"));
    }

    private ElderlyProfile getElderly(Long id) {
        return elderlyProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Elderly profile not found"));
    }

    private UserPackageResponse mapToResponse(UserPackage userPackage) {

        UserPackageResponse response = new UserPackageResponse();

        response.setId(userPackage.getId());
        response.setAccountId(userPackage.getAccount().getId());
        response.setServicePackageId(userPackage.getServicePackage().getId());
        response.setAssignedAt(userPackage.getAssignedAt());
        response.setExpiredAt(userPackage.getExpiredAt());
        response.setStatus(userPackage.getStatus());


        // tránh null crash
        if (userPackage.getElderlyProfile() != null) {
            response.setElderlyProfileId(userPackage.getElderlyProfile().getId());
        }

        return response;
    }
}