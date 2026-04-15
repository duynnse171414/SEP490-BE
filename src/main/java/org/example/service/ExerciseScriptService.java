package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.ExerciseLevel;
import org.example.entity.ExerciseScript;
import org.example.model.request.ExerciseScriptRequest;
import org.example.model.response.ExerciseScriptResponse;
import org.example.repository.ExerciseScriptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseScriptService {
    @Autowired
    ExerciseScriptRepository repository;

    // CREATE
    public ExerciseScriptResponse create(String name,
                                         String description,
                                         int durationMinutes,
                                         String level,
                                         MultipartFile file) {

        try {
            ExerciseScript script = new ExerciseScript();

            script.setName(name);
            script.setDescription(description);
            script.setDurationMinutes(durationMinutes);
            script.setLevel(Enum.valueOf(ExerciseLevel.class, level.toUpperCase()));

            // 🔥 đọc nội dung file
            String content = new String(file.getBytes());
            script.setUploadScript(content);

            script.setDeleted(false);

            repository.save(script);

            return mapToResponse(script);

        } catch (IOException e) {
            throw new RuntimeException("Lỗi đọc file", e);
        }
    }

    // GET ALL
    public List<ExerciseScriptResponse> getAll() {
        return repository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public ExerciseScriptResponse getById(Long id) {
        ExerciseScript script = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Exercise script not found"));

        return mapToResponse(script);
    }

    // UPDATE
    public ExerciseScriptResponse update(Long id, ExerciseScriptRequest request) {

        ExerciseScript script = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Exercise script not found"));

        script.setName(request.getName());
        script.setDescription(request.getDescription());
        script.setDurationMinutes(request.getDurationMinutes());
        script.setLevel(request.getLevel());
        script.setUploadScript(request.getUploadScript());


        repository.save(script);

        return mapToResponse(script);
    }

    // SOFT DELETE
    public void delete(Long id) {

        ExerciseScript script = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Exercise script not found"));

        script.setDeleted(true);
        repository.save(script);
    }

    private ExerciseScriptResponse mapToResponse(ExerciseScript script) {

        ExerciseScriptResponse response = new ExerciseScriptResponse();

        response.setId(script.getId());
        response.setName(script.getName());
        response.setDescription(script.getDescription());
        response.setDurationMinutes(script.getDurationMinutes());
        response.setLevel(script.getLevel());


        return response;
    }
}