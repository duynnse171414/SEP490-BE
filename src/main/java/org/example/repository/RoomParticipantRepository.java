package org.example.repository;

import org.example.entity.RoomParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomParticipantRepository extends JpaRepository<RoomParticipant, Long> {

    List<RoomParticipant> findByRoomIdAndDeletedFalse(Long roomId);

    int countByRoomIdAndDeletedFalse(Long roomId);
}