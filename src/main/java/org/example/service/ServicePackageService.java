package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.model.request.ServicePackageRequest;
import org.example.model.response.RobotActionResponse;
import org.example.model.response.ServicePackageResponse;
import org.example.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
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

    @Autowired
    RobotActionLibraryRepository robotActionRepository;

    // CREATE
    public ServicePackageResponse create(ServicePackageRequest request) {

        ServicePackage servicePackage = new ServicePackage();

        servicePackage.setName(request.getName());
        servicePackage.setDescription(request.getDescription());
        servicePackage.setLevel(request.getLevel());
        servicePackage.setPrice(request.getPrice());
        servicePackage.setActive(request.isActive());
        servicePackage.setDurationDays(request.getDurationDays());
        servicePackage.setDeleted(false);

        // 👇 set robot actions
        if (request.getRobotActionIds() != null) {
            List<RobotActionLibrary> actions =
                    robotActionRepository.findAllById(request.getRobotActionIds());
            servicePackage.setRobotActions(actions);
        }

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



    // GET BY ID
    public ServicePackageResponse getById(Long id) {

        ServicePackage servicePackage = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Service package not found"));

        return mapToResponse(servicePackage);
    }

    public List<RobotActionLibrary> getRobotActions(Long pkgId) {

        ServicePackage pkg = repository.findById(pkgId)
                .orElseThrow(() -> new RuntimeException("Service package not found"));

        if (pkg.getRobotActions() == null) {
            return List.of();
        }

        return pkg.getRobotActions();
    }

    public List<ServicePackageResponse> getByLevel(String level) {

        return repository.findByLevelAndDeletedFalse(level)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }



    public List<RobotActionResponse> getRobotActionsByPackage(Long pkgId) {

        ServicePackage pkg = repository.findById(pkgId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        if (pkg.getRobotActions() == null) return List.of();

        return pkg.getRobotActions().stream().map(a -> {
            RobotActionResponse dto = new RobotActionResponse();
            dto.setId(a.getId());
            dto.setName(a.getName());
            dto.setCode(a.getCode());
            dto.setType(a.getType());
            dto.setDuration(a.getDuration());
            return dto;
        }).toList();
    }

    public List<ServicePackageResponse> getPackagesByAccount(Long accountId) {

        List<UserPackage> userPackages =
                userPackageRepository.findByAccountIdAndDeletedFalse(accountId);

        return userPackages.stream()
                .map(UserPackage::getServicePackage)
                .map(this::mapToResponse)
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
        servicePackage.setDurationDays(request.getDurationDays());

        // 👇 update robot actions
        if (request.getRobotActionIds() != null) {
            List<RobotActionLibrary> actions =
                    robotActionRepository.findAllById(request.getRobotActionIds());
            servicePackage.setRobotActions(actions);
        }

        repository.save(servicePackage);

        return mapToResponse(servicePackage);
    }


    // SOFT DELETE
    public void delete(Long id) {

        ServicePackage servicePackage = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Service package not found"));

        servicePackage.setDeleted(true);

        repository.save(servicePackage);
    }


    public ServicePackageResponse createAuto(ServicePackageRequest request) {

        // 🔥 1. Validate level
        PackageLevel packageLevel;
        try {
            packageLevel = PackageLevel.valueOf(request.getLevel().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Package level không hợp lệ");
        }

        // 🔥 2. Lấy tất cả robot action
        List<RobotActionLibrary> allActions = robotActionRepository.findAll();

        if (allActions.isEmpty()) {
            throw new RuntimeException("Không có robot action nào");
        }

        // 🔥 3. Random theo level
        int limit = switch (packageLevel) {
            case BASIC -> 2;
            case STANDARD -> 4;
            case PREMIUM -> 6;
        };

        Collections.shuffle(allActions);

        List<RobotActionLibrary> selectedActions =
                allActions.stream().limit(limit).toList();

        // 🔥 4. Tạo package
        ServicePackage pkg = new ServicePackage();
        pkg.setName(request.getName());
        pkg.setDescription(request.getDescription());
        pkg.setLevel(packageLevel.name());
        pkg.setPrice(request.getPrice());
        pkg.setDurationDays(request.getDurationDays());
        pkg.setActive(true);
        pkg.setDeleted(false);

        pkg.setRobotActions(selectedActions);

        repository.save(pkg);

        return mapToResponse(pkg);
    }

    private ServicePackageResponse mapToResponse(ServicePackage servicePackage) {

        ServicePackageResponse response = new ServicePackageResponse();

        response.setId(servicePackage.getId());
        response.setName(servicePackage.getName());
        response.setDescription(servicePackage.getDescription());
        response.setLevel(servicePackage.getLevel());
        response.setPrice(servicePackage.getPrice());
        response.setActive(servicePackage.isActive());
        response.setDurationDays(servicePackage.getDurationDays());

        // 👇 map robot actions FULL DATA
        if (servicePackage.getRobotActions() != null) {
            response.setRobotActions(
                    servicePackage.getRobotActions()
                            .stream()
                            .map(a -> {
                                RobotActionResponse dto = new RobotActionResponse();
                                dto.setId(a.getId());
                                dto.setName(a.getName());
                                dto.setCode(a.getCode());
                                dto.setType(a.getType());
                                dto.setDuration(a.getDuration());
                                return dto;
                            })
                            .toList()
            );
        }

        return response;
    }

}