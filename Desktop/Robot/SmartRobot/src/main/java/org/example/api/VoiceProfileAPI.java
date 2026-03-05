package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.model.request.VoiceProfileRequest;
import org.example.model.response.VoiceProfileResponse;
import org.example.service.VoiceProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voice-profiles")
@SecurityRequirement(name = "api")
public class VoiceProfileAPI {
    @Autowired
    VoiceProfileService voiceProfileService;

    @PostMapping
    public VoiceProfileResponse create(@RequestBody VoiceProfileRequest request) {
        return voiceProfileService.create(request);
    }

    @GetMapping
    public List<VoiceProfileResponse> getAll() {
        return voiceProfileService.getAll();
    }

    @GetMapping("/{id}")
    public VoiceProfileResponse getById(@PathVariable Long id) {
        return voiceProfileService.getById(id);
    }

    @PutMapping("/{id}")
    public VoiceProfileResponse update(@PathVariable Long id,
                                       @RequestBody VoiceProfileRequest request) {
        return voiceProfileService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        voiceProfileService.delete(id);
    }
}