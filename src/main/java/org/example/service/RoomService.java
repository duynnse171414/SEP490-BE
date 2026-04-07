package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.Room;
import org.example.model.request.RoomRequest;
import org.example.model.response.RoomResponse;
import org.example.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository repository;

    // CREATE
    public RoomResponse create(RoomRequest request) {

        Room room = new Room();
        room.setRoomName(request.getRoomName());

        repository.save(room);

        return mapToResponse(room);
    }

    // GET ALL
    public List<RoomResponse> getAll() {
        return repository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public RoomResponse getById(Long id) {
        Room room = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        return mapToResponse(room);
    }

    // UPDATE
    public RoomResponse update(Long id, RoomRequest request) {

        Room room = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setRoomName(request.getRoomName());

        repository.save(room);

        return mapToResponse(room);
    }

    // DELETE
    public void delete(Long id) {

        Room room = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setDeleted(true);
        repository.save(room);
    }

    private RoomResponse mapToResponse(Room room) {
        RoomResponse res = new RoomResponse();
        res.setId(room.getId());
        res.setRoomName(room.getRoomName());
        return res;
    }
}