package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.ElderlyProfile;
import org.example.entity.VoiceProfile;
import org.example.model.request.VoiceProfileRequest;
import org.example.model.response.VoiceProfileResponse;
import org.example.repository.ElderlyProfileRepository;
import org.example.repository.VoiceProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoiceProfileService {
     @Autowired
     VoiceProfileRepository voiceProfileRepository;
     @Autowired
     ElderlyProfileRepository elderlyProfileRepository;

    // CREATE
    public VoiceProfileResponse create(VoiceProfileRequest request) {

        ElderlyProfile elderly = elderlyProfileRepository.findById(request.getElderlyId())
                .orElseThrow(() -> new RuntimeException("Elderly not found"));

        VoiceProfile profile = new VoiceProfile();

        profile.setElderly(elderly);
        profile.setVoicePrintHash(request.getVoicePrintHash());
        profile.setSampleCount(request.getSampleCount());
        profile.setCreatedAt(LocalDateTime.now());
        profile.setUpdatedAt(LocalDateTime.now());
        profile.setDeleted(false);

        voiceProfileRepository.save(profile);

        return mapToResponse(profile);
    }

    // GET ALL
    public List<VoiceProfileResponse> getAll() {

        return voiceProfileRepository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public VoiceProfileResponse getById(Long id) {

        VoiceProfile profile = voiceProfileRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("VoiceProfile not found"));

        return mapToResponse(profile);
    }

    // UPDATE
    public VoiceProfileResponse update(Long id, VoiceProfileRequest request) {

        VoiceProfile profile = voiceProfileRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("VoiceProfile not found"));

        ElderlyProfile elderly = elderlyProfileRepository.findById(request.getElderlyId())
                .orElseThrow(() -> new RuntimeException("Elderly not found"));

        profile.setElderly(elderly);
        profile.setVoicePrintHash(request.getVoicePrintHash());
        profile.setSampleCount(request.getSampleCount());
        profile.setUpdatedAt(LocalDateTime.now());

        voiceProfileRepository.save(profile);

        return mapToResponse(profile);
    }

    // SOFT DELETE
    public void delete(Long id) {

        VoiceProfile profile = voiceProfileRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("VoiceProfile not found"));

        profile.setDeleted(true);

        voiceProfileRepository.save(profile);
    }

    private VoiceProfileResponse mapToResponse(VoiceProfile profile) {

        VoiceProfileResponse response = new VoiceProfileResponse();

        response.setId(profile.getId());
        response.setElderlyId(profile.getElderly().getId());
        response.setVoicePrintHash(profile.getVoicePrintHash());
        response.setSampleCount(profile.getSampleCount());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());

        return response;
    }
}