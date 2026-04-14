package org.example.service;

import org.example.entity.Account;
import org.example.entity.ElderlyProfile;
import org.example.entity.Room;
import org.example.exception.NotFoundException;
import org.example.model.response.ElderlyProfileResponse;
import org.example.model.request.ElderlyProfileRequest;
import org.example.repository.AccountRepository;
import org.example.repository.ElderlyProfileRepository;
import org.example.repository.RoomRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ElderlyProfileService {

    @Autowired
    ElderlyProfileRepository elderlyProfileRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    RoomRepository roomRepository;

    // CREATE
    public ElderlyProfileResponse create(Long accountId, ElderlyProfileRequest request) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new NotFoundException("Account not found"));

        ElderlyProfile profile = new ElderlyProfile();
        profile.setAccount(account);
        profile.setName(request.getName());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setHealthNotes(request.getHealthNotes());
        profile.setPreferredLanguage(request.getPreferredLanguage());
        profile.setSpeakingSpeed(request.getSpeakingSpeed());

        ElderlyProfile saved = elderlyProfileRepository.save(profile);

        ElderlyProfileResponse response = modelMapper.map(saved, ElderlyProfileResponse.class);
        response.setAccountId(saved.getAccount().getId());

        return response;
    }

    public List<ElderlyProfileResponse> getAll() {

        return elderlyProfileRepository.findByDeletedFalse()
                .stream()
                .map(profile -> {
                    ElderlyProfileResponse response =
                            modelMapper.map(profile, ElderlyProfileResponse.class);
                    response.setAccountId(profile.getAccount().getId());
                    return response;
                })
                .collect(Collectors.toList());
    }

    public ElderlyProfileResponse getById(Long id) {

        ElderlyProfile profile = elderlyProfileRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new NotFoundException("Profile not found"));

        ElderlyProfileResponse response =
                modelMapper.map(profile, ElderlyProfileResponse.class);
        response.setAccountId(profile.getAccount().getId());

        return response;
    }

    // UPDATE
    public ElderlyProfileResponse update(Long id, ElderlyProfileRequest request) {

        ElderlyProfile profile = elderlyProfileRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Profile not found"));

        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setHealthNotes(request.getHealthNotes());
        profile.setPreferredLanguage(request.getPreferredLanguage());
        profile.setSpeakingSpeed(request.getSpeakingSpeed());
        profile.setName(request.getName());
        if (request.getRoomId() != null) {
            Room room = roomRepository.findById(request.getRoomId())
                    .orElseThrow(() -> new NotFoundException("Room not found"));
            profile.setRoom(room);
        }

        ElderlyProfile updated = elderlyProfileRepository.save(profile);

        return modelMapper.map(updated, ElderlyProfileResponse.class);
    }

    // DELETE
    public void delete(Long id) {

        ElderlyProfile profile = elderlyProfileRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Profile not found"));

        profile.setDeleted(true);
        elderlyProfileRepository.save(profile);
    }

    public List<ElderlyProfileResponse> getByAccount(Long accountId) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new NotFoundException("Account not found"));
        

        return elderlyProfileRepository.findByAccountIdAndDeletedFalse(accountId)
                .stream()
                .map(profile -> {
                    ElderlyProfileResponse response =
                            modelMapper.map(profile, ElderlyProfileResponse.class);
                    response.setAccountId(profile.getAccount().getId());
                    return response;
                })
                .collect(Collectors.toList());
    }
}