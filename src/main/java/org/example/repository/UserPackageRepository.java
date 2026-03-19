package org.example.repository;

import org.example.entity.UserPackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserPackageRepository extends JpaRepository<UserPackage, Long> {

    List<UserPackage> findByDeletedFalse();

    Optional<UserPackage> findByIdAndDeletedFalse(Long id);

}