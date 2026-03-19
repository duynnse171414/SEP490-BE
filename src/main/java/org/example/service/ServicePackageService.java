package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.ServicePackage;
import org.example.model.request.ServicePackageRequest;
import org.example.model.response.ServicePackageResponse;
import org.example.repository.ServicePackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicePackageService {
     @Autowired
     ServicePackageRepository repository;

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

    // GET BY ID
    public ServicePackageResponse getById(Long id) {

        ServicePackage servicePackage = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Service package not found"));

        return mapToResponse(servicePackage);
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