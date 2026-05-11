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

    /**
     * Số robot action tối đa cho mỗi level package:
     *  BASIC    → 5
     *  STANDARD → 15
     *  PREMIUM  → unlimited
     */
    private int resolveActionLimitByLevel(String level) {

        if (level == null) {
            throw new RobotActionLimitException("Level không được để trống");
        }

        PackageLevel pkgLevel;
        try {
            pkgLevel = PackageLevel.valueOf(level.toUpperCase());
        } catch (Exception e) {
            throw new RobotActionLimitException("Level không hợp lệ: " + level);
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
                    "Gói " + level.toUpperCase() + " chỉ được phép tối đa " + limit +
                            " robot actions (đang cố thêm " + requestedSize + ")."
            );
        }
    }

    // CREATE
    public ServicePackageResponse create(ServicePackageRequest request) {

        // ✅ CHECK LIMIT TRƯỚC KHI TẠO
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

            // ✅ Validate tất cả ID đều tồn tại
            if (actions.size() != request.getRobotActionIds().size()) {
                throw new RuntimeException("Một số robot action không tồn tại");
            }

            servicePackage.setRobotActions(actions);
        }

        repository.save(servicePackage);
        return mapToResponse(servicePackage);
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

        ServicePackage servicePackage = repository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Service package not found"));

        // ✅ CHECK LIMIT (theo level MỚI nếu có đổi)
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
                throw new RuntimeException("Một số robot action không tồn tại");
            }

            servicePackage.setRobotActions(actions);
        }

        repository.save(servicePackage);
        return mapToResponse(servicePackage);
    }

    // ServicePackageService
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

    // Cho USER xem (chỉ package active)
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

    // Cho ADMIN xem tất cả (cả inactive)
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
            throw new RuntimeException("Package level không hợp lệ");
        }

        List<RobotActionLibrary> allActions = robotActionRepository.findAll();
        if (allActions.isEmpty()) {
            throw new RuntimeException("Không có robot action nào");
        }

        // ✅ Số lượng action theo level (đồng bộ với validateActionLimit)
        int limit = switch (packageLevel) {
            case BASIC    -> 5;
            case STANDARD -> 15;
            case PREMIUM  -> Integer.MAX_VALUE;   // lấy tất cả
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

    // ServicePackageService
    public Map<String, Object> getActionLimitInfo(String level) {
        int limit = resolveActionLimitByLevel(level);
        Map<String, Object> result = new HashMap<>();
        result.put("level", level.toUpperCase());
        result.put("limit", limit);
        result.put("unlimited", limit == UNLIMITED);
        return result;
    }

}