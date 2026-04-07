package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.ExerciseScript;
import org.example.model.request.ExerciseScriptRequest;
import org.example.model.response.ExerciseScriptResponse;
import org.example.repository.ExerciseScriptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseScriptService {
    @Autowired
    ExerciseScriptRepository repository;

    // CREATE
    public ExerciseScriptResponse create(ExerciseScriptRequest request) {

        ExerciseScript script = new ExerciseScript();
        script.setName(request.getName());
        script.setDescription(request.getDescription());
        script.setDurationMinutes(request.getDurationMinutes());
        script.setDifficultyLevel(request.getDifficultyLevel());
        script.setUploadScript(request.getUploadScript());


        script.setDeleted(false);

        repository.save(script);

        return mapToResponse(script);
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
        script.setDifficultyLevel(request.getDifficultyLevel());
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
        response.setDifficultyLevel(script.getDifficultyLevel());
        response.setUploadScript(script.getUploadScript());

        return response;
    }
}