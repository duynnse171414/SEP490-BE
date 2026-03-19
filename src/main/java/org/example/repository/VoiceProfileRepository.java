package org.example.repository;

import org.example.entity.VoiceProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VoiceProfileRepository extends JpaRepository<VoiceProfile, Long> {

    List<VoiceProfile> findByDeletedFalse();

    Optional<VoiceProfile> findByIdAndDeletedFalse(Long id);

}