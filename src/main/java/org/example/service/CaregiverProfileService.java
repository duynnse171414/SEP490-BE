package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.Account;
import org.example.entity.CaregiverProfile;
import org.example.exception.NotFoundException;
import org.example.model.request.CaregiverProfileRequest;
import org.example.model.request.ElderlyProfileRequest;
import org.example.model.response.CaregiverProfileResponse;
import org.example.model.response.ElderlyProfileResponse;
import org.example.repository.AccountRepository;
import org.example.repository.CaregiverProfileRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaregiverProfileService {

    private final CaregiverProfileRepository repository;
    private final AccountRepository accountRepository;

    @Autowired
    CaregiverProfileRepository caregiverProfileRepository;
    @Autowired
    ModelMapper modelMapper;


    // CREATE
    public CaregiverProfileResponse create(Long accountId, CaregiverProfileRequest request) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new NotFoundException("Account not found"));


        // ✅ map request → entity (giống Elderly)
        CaregiverProfile profile = modelMapper.map(request, CaregiverProfile.class);

        // ✅ set account
        profile.setAccount(account);
        profile.setDeleted(false);

        CaregiverProfile saved = caregiverProfileRepository.save(profile);

        // ✅ map entity → response (giống Elderly)
        CaregiverProfileResponse response =
                modelMapper.map(saved, CaregiverProfileResponse.class);

        response.setAccountId(account.getId());

        return response;
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

        profile.setName(request.getName());
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
        response.setName(profile.getName());
        response.setRelationship(profile.getRelationship());
        response.setNotificationPreference(profile.getNotificationPreference());


        if (profile.getAccount() != null) {
            response.setAccountId(profile.getAccount().getId());
            response.setAccountEmail(profile.getAccount().getEmail());
        }

        return response;
    }

    public List<CaregiverProfileResponse> getByAccount(Long accountId) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new NotFoundException("Account not found"));


        return caregiverProfileRepository.findByAccountIdAndDeletedFalse(accountId)
                .stream()
                .map(profile -> {
                    CaregiverProfileResponse response =
                            modelMapper.map(profile, CaregiverProfileResponse.class);
                    response.setAccountId(profile.getAccount().getId());
                    return response;
                })
                .collect(Collectors.toList());
    }


}
