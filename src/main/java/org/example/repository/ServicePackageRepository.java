package org.example.repository;

import org.example.entity.ServicePackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServicePackageRepository extends JpaRepository<ServicePackage, Long> {


    List<ServicePackage> findByActiveTrue();
    Optional<ServicePackage> findByIdAndActiveTrue(Long id);
    List<ServicePackage> findByLevelAndActiveTrue(String level);


    List<ServicePackage> findAll();



}