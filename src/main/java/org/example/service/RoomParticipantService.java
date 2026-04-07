package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.Account;
import org.example.entity.Room;
import org.example.entity.RoomParticipant;
import org.example.model.request.RoomParticipantRequest;
import org.example.model.response.RoomParticipantResponse;
import org.example.repository.AccountRepository;
import org.example.repository.RoomParticipantRepository;
import org.example.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomParticipantService {

    private final RoomParticipantRepository repository;
    private final RoomRepository roomRepository;
    private final AccountRepository accountRepository;

    // ADD PARTICIPANT
    public RoomParticipantResponse add(RoomParticipantRequest request) {

        Room room = roomRepository.findByIdAndDeletedFalse(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // 🚫 limit 4 người / room
        if (repository.countByRoomIdAndDeletedFalse(room.getId()) >= 4) {
            throw new RuntimeException("Room is full (max 4 participants)");
        }

        RoomParticipant participant = new RoomParticipant();
        participant.setRoom(room);
        participant.setAccount(account);


        repository.save(participant);

        return mapToResponse(participant);
    }

    // GET BY ROOM
    public List<RoomParticipantResponse> getByRoom(Long roomId) {
        return repository.findByRoomIdAndDeletedFalse(roomId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // REMOVE (soft delete)
    public void remove(Long id) {
        RoomParticipant p = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        p.setDeleted(true);
        repository.save(p);
    }

    private RoomParticipantResponse mapToResponse(RoomParticipant p) {
        RoomParticipantResponse res = new RoomParticipantResponse();
        res.setId(p.getId());
        res.setRoomId(p.getRoom().getId());
        res.setAccountId(p.getAccount().getId());

        return res;
    }
}