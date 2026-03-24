package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.example.model.request.VoiceCommandRequest;
import org.example.model.response.VoiceCommandResponse;
import org.example.service.VoiceCommandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voice-commands")
@SecurityRequirement(name = "api")
public class VoiceCommandAPI {

    @Autowired
    VoiceCommandService voiceCommandService;

    // Tạo lệnh
    @PostMapping
    @PreAuthorize("hasRole('ELDERLYUSER')")
    public VoiceCommandResponse create(@RequestBody VoiceCommandRequest request) {
        return voiceCommandService.create(request);
    }

    // Admin xem tất cả
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','MANAGER')")
    public List<VoiceCommandResponse> getAll() {
        return voiceCommandService.getAll();
    }


    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public VoiceCommandResponse getById(@PathVariable Long id) {
        return voiceCommandService.getById(id);
    }


    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public VoiceCommandResponse update(@PathVariable Long id,
                                       @RequestBody VoiceCommandRequest request) {
        return voiceCommandService.update(id, request);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    public void delete(@PathVariable Long id) {
        voiceCommandService.delete(id);
    }
}