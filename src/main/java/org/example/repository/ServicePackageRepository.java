package org.example.repository;

import org.example.entity.ServicePackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServicePackageRepository extends JpaRepository<ServicePackage, Long> {

    // Mới (catalog cho user):
    List<ServicePackage> findByActiveTrue();
    Optional<ServicePackage> findByIdAndActiveTrue(Long id);
    List<ServicePackage> findByLevelAndActiveTrue(String level);

    // Cho admin xem tất cả:
    List<ServicePackage> findAll();   // có sẵn



}