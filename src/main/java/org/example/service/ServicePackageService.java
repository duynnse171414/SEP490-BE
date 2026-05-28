package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.exception.RobotActionLimitException;
import org.example.model.request.ServicePackageRequest;
import org.example.model.response.RobotActionResponse;
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

    @Autowired
    RobotActionLibraryRepository robotActionRepository;

    private static final int UNLIMITED = -1;


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

    private void validateActionLimit(String level, int requestedSize) {
        int limit = resolveActionLimitByLevel(level);
        if (limit != UNLIMITED && requestedSize > limit) {
            throw new RobotActionLimitException(
                    "The package " + level.toUpperCase() + " is only allowed up to a maximum of " + limit +
                            " robot actions (trying to add " + requestedSize + ")."
            );
        }
    }

    private void validateNoDuplicateActions(List<Long> robotActionIds) {
        if (robotActionIds == null || robotActionIds.isEmpty()) return;

        Set<Long> seen = new HashSet<>();
        List<Long> duplicates = robotActionIds.stream()
                .filter(id -> !seen.add(id))
                .distinct()
                .toList();

        if (!duplicates.isEmpty()) {
            throw new RobotActionLimitException(
                    "Duplicate robot action IDs are not allowed: " + duplicates
            );
        }
    }

    // CREATE
    public ServicePackageResponse create(ServicePackageRequest request) {

        validateNoDuplicateActions(request.getRobotActionIds());

        int requestedSize = request.getRobotActionIds() != null
                ? request.getRobotActionIds().size() : 0;
        validateActionLimit(request.getLevel(), requestedSize);

        ServicePackage servicePackage = new ServicePackage();
        servicePackage.setName(request.getName());
        servicePackage.setDescription(request.getDescription());
        servicePackage.setLevel(request.getLevel());
        servicePackage.setPrice(request.getPrice());
        servicePackage.setActive(request.isActive());
        servicePackage.setDurationDays(request.getDurationDays());


        if (request.getRobotActionIds() != null) {
            List<RobotActionLibrary> actions =
                    robotActionRepository.findAllById(request.getRobotActionIds());

            if (actions.size() != request.getRobotActionIds().size()) {
                throw new RuntimeException("Some actions performed by robots do not exist.");
            }

            servicePackage.setRobotActions(actions);
        }

        repository.save(servicePackage);
        return mapToResponse(servicePackage);
    }

    // UPDATE
    public ServicePackageResponse update(Long id, ServicePackageRequest request) {

        ServicePackage servicePackage = repository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Service package not found"));

        validateNoDuplicateActions(request.getRobotActionIds());

        int requestedSize = request.getRobotActionIds() != null
                ? request.getRobotActionIds().size() : 0;
        validateActionLimit(request.getLevel(), requestedSize);

        servicePackage.setName(request.getName());
        servicePackage.setDescription(request.getDescription());
        servicePackage.setLevel(request.getLevel());
        servicePackage.setPrice(request.getPrice());
        servicePackage.setActive(request.isActive());
        servicePackage.setDurationDays(request.getDurationDays());

        if (request.getRobotActionIds() != null) {
            List<RobotActionLibrary> actions =
                    robotActionRepository.findAllById(request.getRobotActionIds());

            if (actions.size() != request.getRobotActionIds().size()) {
                throw new RuntimeException("Some action robots don't exist.");
            }

            servicePackage.setRobotActions(actions);
        }

        repository.save(servicePackage);
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

    public List<ServicePackageResponse> getAll() {
        return repository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ServicePackageResponse getById(Long id) {
        ServicePackage servicePackage = repository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Service package not found"));
        return mapToResponse(servicePackage);
    }

    public List<ServicePackageResponse> getByLevel(String level) {
        return repository.findByLevelAndActiveTrue(level)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ServicePackageResponse> getAllForAdmin() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ServicePackageResponse createAuto(ServicePackageRequest request) {

        PackageLevel packageLevel;
        try {
            packageLevel = PackageLevel.valueOf(request.getLevel().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Invalid package level");
        }

        List<RobotActionLibrary> allActions = robotActionRepository.findAll();
        if (allActions.isEmpty()) {
            throw new RuntimeException("No robot action");
        }

        int limit = switch (packageLevel) {
            case BASIC    -> 5;
            case STANDARD -> 15;
            case PREMIUM  -> Integer.MAX_VALUE;
        };

        Collections.shuffle(allActions);

        List<RobotActionLibrary> selectedActions = allActions.stream()
                .limit(Math.min(limit, allActions.size()))
                .toList();

        ServicePackage pkg = new ServicePackage();
        pkg.setName(request.getName());
        pkg.setDescription(request.getDescription());
        pkg.setLevel(packageLevel.name());
        pkg.setPrice(request.getPrice());
        pkg.setDurationDays(request.getDurationDays());
        pkg.setActive(true);
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

    public Map<String, Object> getActionLimitInfo(String level) {
        int limit = resolveActionLimitByLevel(level);
        Map<String, Object> result = new HashMap<>();
        result.put("level", level.toUpperCase());
        result.put("limit", limit);
        result.put("unlimited", limit == UNLIMITED);
        return result;
    }

}