package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.InteractionLog;
import org.example.entity.VoiceCommand;
import org.example.model.request.VoiceCommandRequest;
import org.example.model.response.VoiceCommandResponse;
import org.example.repository.InteractionLogRepository;
import org.example.repository.VoiceCommandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoiceCommandService {
    @Autowired
    VoiceCommandRepository voiceCommandRepository;
    @Autowired
    InteractionLogRepository interactionLogRepository;

    // CREATE
    public VoiceCommandResponse create(VoiceCommandRequest request) {

        InteractionLog interaction = interactionLogRepository.findById(request.getInteractionId())
                .orElseThrow(() -> new RuntimeException("Interaction not found"));

        VoiceCommand command = new VoiceCommand();

        command.setInteraction(interaction);
        command.setCommandText(request.getCommandText());
        command.setCommandType(request.getCommandType());
        command.setCreatedAt(LocalDateTime.now());
        command.setDeleted(false);

        voiceCommandRepository.save(command);

        return mapToResponse(command);
    }

    // GET ALL
    public List<VoiceCommandResponse> getAll() {

        return voiceCommandRepository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public VoiceCommandResponse getById(Long id) {

        VoiceCommand command = voiceCommandRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Voice command not found"));

        return mapToResponse(command);
    }

    // UPDATE
    public VoiceCommandResponse update(Long id, VoiceCommandRequest request) {

        VoiceCommand command = voiceCommandRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Voice command not found"));

        InteractionLog interaction = interactionLogRepository.findById(request.getInteractionId())
                .orElseThrow(() -> new RuntimeException("Interaction not found"));

        command.setInteraction(interaction);
        command.setCommandText(request.getCommandText());
        command.setCommandType(request.getCommandType());

        voiceCommandRepository.save(command);

        return mapToResponse(command);
    }

    // SOFT DELETE
    public void delete(Long id) {

        VoiceCommand command = voiceCommandRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Voice command not found"));

        command.setDeleted(true);

        voiceCommandRepository.save(command);
    }

    private VoiceCommandResponse mapToResponse(VoiceCommand command) {

        VoiceCommandResponse response = new VoiceCommandResponse();

        response.setId(command.getId());
        response.setInteractionId(command.getInteraction().getId());
        response.setCommandText(command.getCommandText());
        response.setCommandType(command.getCommandType());
        response.setCreatedAt(command.getCreatedAt());

        return response;
    }
}