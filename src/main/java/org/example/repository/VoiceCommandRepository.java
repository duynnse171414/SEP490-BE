package org.example.repository;

import org.example.entity.VoiceCommand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VoiceCommandRepository extends JpaRepository<VoiceCommand, Long> {

    List<VoiceCommand> findByDeletedFalse();

    Optional<VoiceCommand> findByIdAndDeletedFalse(Long id);

}