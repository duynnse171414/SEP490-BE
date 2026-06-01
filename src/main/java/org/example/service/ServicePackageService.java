package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.exception.RobotActionLimitException;
import org.example.model.request.ServicePackageRequest;
import org.example.model.response.ServicePackageResponse;
import org.example.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicePackageService {

    @Autowired
    ServicePackageRepository repository;

    @Autowired
    UserPackageRepository userPackageRepository;

    private static final int UNLIMITED = -1;

    // ============= RESOLVE LIMIT =============
    private int resolveActionLimitByLevel(String level) {
        if (level == null) {
            throw new RobotActionLimitException("Level can not be blank");
        }
        PackageLevel pkgLevel;
        try {
            pkgLevel = PackageLevel.valueOf(level.toUpperCase());
        } catch (Exception e) {
            throw new RobotActionLimitException("Invalid level: " + level);
        }
        return switch (pkgLevel) {
            case BASIC    -> 5;
            case STANDARD -> 15;
            case PREMIUM  -> UNLIMITED;
        };
    }

    // ============= CREATE =============
    public ServicePackageResponse create(ServicePackageRequest request) {

        ServicePackage servicePackage = new ServicePackage();
        servicePackage.setName(request.getName());
        servicePackage.setDescription(request.getDescription());
        servicePackage.setLevel(request.getLevel());
        servicePackage.setPrice(request.getPrice());
        servicePackage.setActive(request.isActive());
        servicePackage.setDurationDays(request.getDurationDays());


        servicePackage.setActionLimit(resolveActionLimitByLevel(request.getLevel()));

        repository.save(servicePackage);
        return mapToResponse(servicePackage);
    }

    // ============= UPDATE =============
    public ServicePackageResponse update(Long id, ServicePackageRequest request) {

        ServicePackage servicePackage = repository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Service package not found"));

        servicePackage.setName(request.getName());
        servicePackage.setDescription(request.getDescription());
        servicePackage.setLevel(request.getLevel());
        servicePackage.setPrice(request.getPrice());
        servicePackage.setActive(request.isActive());
        servicePackage.setDurationDays(request.getDurationDays());


        servicePackage.setActionLimit(resolveActionLimitByLevel(request.getLevel()));

        repository.save(servicePackage);
        return mapToResponse(servicePackage);
    }

    // ============= GET ALL (user) =============
    public List<ServicePackageResponse> getAll() {
        return repository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============= GET BY ID =============
    public ServicePackageResponse getById(Long id) {
        ServicePackage servicePackage = repository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Service package not found"));
        return mapToResponse(servicePackage);
    }

    // ============= GET BY LEVEL =============
    public List<ServicePackageResponse> getByLevel(String level) {
        return repository.findByLevelAndActiveTrue(level)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ============= GET ALL (admin) =============
    public List<ServicePackageResponse> getAllForAdmin() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ============= DEACTIVATE / ACTIVATE =============
    public void deactivate(Long id) {
        ServicePackage servicePackage = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service package not found"));
        servicePackage.setActive(false);
        repository.save(servicePackage);
    }

    public ServicePackageResponse activate(Long id) {
        ServicePackage servicePackage = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service package not found"));
        servicePackage.setActive(true);
        repository.save(servicePackage);
        return mapToResponse(servicePackage);
    }

    // ============= CREATE AUTO =============
    public ServicePackageResponse createAuto(ServicePackageRequest request) {

        PackageLevel packageLevel;
        try {
            packageLevel = PackageLevel.valueOf(request.getLevel().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Invalid package level");
        }

        ServicePackage pkg = new ServicePackage();
        pkg.setName(request.getName());
        pkg.setDescription(request.getDescription());
        pkg.setLevel(packageLevel.name());
        pkg.setPrice(request.getPrice());
        pkg.setDurationDays(request.getDurationDays());
        pkg.setActive(true);


        pkg.setActionLimit(resolveActionLimitByLevel(packageLevel.name()));

        repository.save(pkg);
        return mapToResponse(pkg);
    }

    // ============= LIMIT INFO =============
    public Map<String, Object> getActionLimitInfo(String level) {
        int limit = resolveActionLimitByLevel(level);
        Map<String, Object> result = new HashMap<>();
        result.put("level", level.toUpperCase());
        result.put("limit", limit);
        result.put("unlimited", limit == UNLIMITED);
        return result;
    }

    // ============= MAPPER =============
    private ServicePackageResponse mapToResponse(ServicePackage servicePackage) {

        ServicePackageResponse response = new ServicePackageResponse();
        response.setId(servicePackage.getId());
        response.setName(servicePackage.getName());
        response.setDescription(servicePackage.getDescription());
        response.setLevel(servicePackage.getLevel());
        response.setPrice(servicePackage.getPrice());
        response.setActive(servicePackage.isActive());
        response.setDurationDays(servicePackage.getDurationDays());
        response.setActionLimit(servicePackage.getActionLimit());

        return response;
    }
}