package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.Account;
import org.example.entity.ServicePackage;
import org.example.entity.UserPackage;
import org.example.model.request.UserPackageRequest;
import org.example.model.response.UserPackageResponse;
import org.example.repository.AccountRepository;
import org.example.repository.ServicePackageRepository;
import org.example.repository.UserPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserPackageService {
    @Autowired
    UserPackageRepository userPackageRepository;
    @Autowired
    AccountRepository accountRepository;
    @Autowired
    ServicePackageRepository servicePackageRepository;

    // CREATE
    public UserPackageResponse create(UserPackageRequest request) {

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        ServicePackage servicePackage = servicePackageRepository.findById(request.getServicePackageId())
                .orElseThrow(() -> new RuntimeException("Service package not found"));

        UserPackage userPackage = new UserPackage();

        userPackage.setAccount(account);
        userPackage.setServicePackage(servicePackage);
        userPackage.setAssignedAt(request.getAssignedAt());
        userPackage.setExpiredAt(request.getExpiredAt());
        userPackage.setDeleted(false);

        userPackageRepository.save(userPackage);

        return mapToResponse(userPackage);
    }

    // GET ALL
    public List<UserPackageResponse> getAll() {

        return userPackageRepository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public UserPackageResponse getById(Long id) {

        UserPackage userPackage = userPackageRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("UserPackage not found"));

        return mapToResponse(userPackage);
    }

    // UPDATE
    public UserPackageResponse update(Long id, UserPackageRequest request) {

        UserPackage userPackage = userPackageRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("UserPackage not found"));

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        ServicePackage servicePackage = servicePackageRepository.findById(request.getServicePackageId())
                .orElseThrow(() -> new RuntimeException("Service package not found"));

        userPackage.setAccount(account);
        userPackage.setServicePackage(servicePackage);
        userPackage.setAssignedAt(request.getAssignedAt());
        userPackage.setExpiredAt(request.getExpiredAt());

        userPackageRepository.save(userPackage);

        return mapToResponse(userPackage);
    }

    // SOFT DELETE
    public void delete(Long id) {

        UserPackage userPackage = userPackageRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("UserPackage not found"));

        userPackage.setDeleted(true);

        userPackageRepository.save(userPackage);
    }

    private UserPackageResponse mapToResponse(UserPackage userPackage) {

        UserPackageResponse response = new UserPackageResponse();

        response.setId(userPackage.getId());
        response.setAccountId(userPackage.getAccount().getId());
        response.setServicePackageId(userPackage.getServicePackage().getId());
        response.setAssignedAt(userPackage.getAssignedAt());
        response.setExpiredAt(userPackage.getExpiredAt());

        return response;
    }
}