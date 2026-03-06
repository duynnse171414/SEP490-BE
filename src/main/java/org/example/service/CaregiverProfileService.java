package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.Account;
import org.example.entity.CaregiverProfile;
import org.example.model.request.CaregiverProfileRequest;
import org.example.model.response.CaregiverProfileResponse;
import org.example.repository.AccountRepository;
import org.example.repository.CaregiverProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaregiverProfileService {

    private final CaregiverProfileRepository repository;
    private final AccountRepository accountRepository;

    // CREATE
    public CaregiverProfileResponse create(CaregiverProfileRequest request) {

        if (repository.existsByAccountId(request.getAccountId())) {
            throw new RuntimeException("Account already has caregiver profile");
        }

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        CaregiverProfile profile = new CaregiverProfile();
        profile.setAccount(account);
        profile.setRelationship(request.getRelationship());
        profile.setNotificationPreference(request.getNotificationPreference());

        repository.save(profile);

        return mapToResponse(profile);
    }

    // GET ALL
    public List<CaregiverProfileResponse> getAll() {
        return repository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public CaregiverProfileResponse getById(Long id) {
        CaregiverProfile profile = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Caregiver profile not found"));

        return mapToResponse(profile);
    }

    // UPDATE
    public CaregiverProfileResponse update(Long id, CaregiverProfileRequest request) {

        CaregiverProfile profile = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Caregiver profile not found"));

        profile.setRelationship(request.getRelationship());
        profile.setNotificationPreference(request.getNotificationPreference());

        repository.save(profile);

        return mapToResponse(profile);
    }

    // SOFT DELETE
    public void delete(Long id) {

        CaregiverProfile profile = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Caregiver profile not found"));

        profile.setDeleted(true);
        repository.save(profile);
    }

    private CaregiverProfileResponse mapToResponse(CaregiverProfile profile) {

        CaregiverProfileResponse response = new CaregiverProfileResponse();

        response.setId(profile.getId());
        response.setRelationship(profile.getRelationship());
        response.setNotificationPreference(profile.getNotificationPreference());

        if (profile.getAccount() != null) {
            response.setAccountId(profile.getAccount().getId());
            response.setAccountEmail(profile.getAccount().getEmail());
        }

        return response;
    }
}
