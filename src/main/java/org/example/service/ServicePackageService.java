package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.model.request.ServicePackageRequest;
import org.example.model.response.ServicePackageResponse;
import org.example.repository.ElderlyProfileRepository;
import org.example.repository.ExerciseScriptRepository;
import org.example.repository.ServicePackageRepository;
import org.example.repository.UserPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicePackageService {
     @Autowired
     ServicePackageRepository repository;

     @Autowired
    ExerciseScriptRepository exerciseScriptRepository;

     @Autowired
    UserPackageRepository userPackageRepository;

     @Autowired
    ElderlyProfileRepository elderlyProfileRepository;

    // CREATE
    public ServicePackageResponse create(ServicePackageRequest request) {

        ServicePackage servicePackage = new ServicePackage();

        servicePackage.setName(request.getName());
        servicePackage.setDescription(request.getDescription());
        servicePackage.setLevel(request.getLevel());
        servicePackage.setPrice(request.getPrice());
        servicePackage.setActive(request.isActive());
        servicePackage.setDeleted(false);

        repository.save(servicePackage);

        return mapToResponse(servicePackage);
    }

    // GET ALL
    public List<ServicePackageResponse> getAll() {

        return repository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ExerciseScript> getExercises(Long pkgId) {

        ServicePackage pkg = repository.findById(pkgId)
                .orElseThrow(() -> new RuntimeException("Service package not found"));

        if (pkg.getExercises() == null) {
            return List.of();
        }

        return pkg.getExercises()
                .stream()
                .filter(e -> !e.isDeleted())
                .toList();
    }

    // GET BY ID
    public ServicePackageResponse getById(Long id) {

        ServicePackage servicePackage = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Service package not found"));

        return mapToResponse(servicePackage);
    }


    public List<ExerciseScript> getAvailableExercises(Long elderlyId) {

        // 1. Lấy elderly
        ElderlyProfile elderly = elderlyProfileRepository.findById(elderlyId)
                .orElseThrow(() -> new RuntimeException("Elderly not found"));

        if (elderly.getAccount() == null) {
            throw new RuntimeException("Elderly chưa có account");
        }

        Account account = elderly.getAccount();

        // 2. Lấy package active
        UserPackage userPackage = userPackageRepository
                .findActivePackage(account)
                .orElseThrow(() -> new RuntimeException("No active package"));

        ServicePackage servicePackage = userPackage.getServicePackage();

        // 3. Check package active
        if (!servicePackage.isActive() || servicePackage.isDeleted()) {
            throw new RuntimeException("Package not usable");
        }

        // 4. Lấy exercises
        if (servicePackage.getExercises() == null) {
            return List.of();
        }

        return servicePackage.getExercises()
                .stream()
                .filter(e -> !e.isDeleted())
                .toList();
    }
    // UPDATE
    public ServicePackageResponse update(Long id, ServicePackageRequest request) {

        ServicePackage servicePackage = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Service package not found"));

        servicePackage.setName(request.getName());
        servicePackage.setDescription(request.getDescription());
        servicePackage.setLevel(request.getLevel());
        servicePackage.setPrice(request.getPrice());
        servicePackage.setActive(request.isActive());

        repository.save(servicePackage);

        return mapToResponse(servicePackage);
    }

    public void updateExercises(Long pkgId, List<Long> exerciseIds) {

        ServicePackage pkg = repository.findById(pkgId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        List<ExerciseScript> exercises = exerciseScriptRepository.findAllById(exerciseIds);

        pkg.setExercises(exercises);

        repository.save(pkg);
    }

    // SOFT DELETE
    public void delete(Long id) {

        ServicePackage servicePackage = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Service package not found"));

        servicePackage.setDeleted(true);

        repository.save(servicePackage);
    }

    private ServicePackageResponse mapToResponse(ServicePackage servicePackage) {

        ServicePackageResponse response = new ServicePackageResponse();

        response.setId(servicePackage.getId());
        response.setName(servicePackage.getName());
        response.setDescription(servicePackage.getDescription());
        response.setLevel(servicePackage.getLevel());
        response.setPrice(servicePackage.getPrice());
        response.setActive(servicePackage.isActive());

        return response;
    }
}