package org.example.service;

import org.example.entity.ElderlyProfile;
import org.example.entity.Robot;
import org.example.exception.NotFoundException;
import org.example.model.response.RobotResponse;
import org.example.model.request.RobotRequest;
import org.example.repository.ElderlyProfileRepository;
import org.example.repository.RobotRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RobotService {

    @Autowired
    RobotRepository robotRepository;

    @Autowired
    ElderlyProfileRepository elderlyProfileRepository;

    @Autowired
    ModelMapper modelMapper;

    // CREATE
    public RobotResponse create(RobotRequest request) {

        Robot robot = new Robot();
        robot.setRobotName(request.getRobotName());
        robot.setModel(request.getModel());
        robot.setSerialNumber(request.getSerialNumber());
        robot.setFirmwareVersion(request.getFirmwareVersion());
        robot.setStatus(request.getStatus());

        if (robotRepository.existsByAssignedElderlyId(request.getAssignedElderlyId())) {
            throw new RuntimeException("This elderly is already assigned to another robot");
        }

        if (request.getAssignedElderlyId() != null) {
            ElderlyProfile elderly = elderlyProfileRepository
                    .findById(request.getAssignedElderlyId())
                    .orElseThrow(() -> new RuntimeException("Elderly not found"));

            robot.setAssignedElderly(elderly);
        }

        robotRepository.save(robot);

        return mapToResponse(robot);
    }

    // GET ALL
    public List<RobotResponse> getAll() {
        return robotRepository.findByDeletedFalse()
                .stream()
                .map(robot -> modelMapper.map(robot, RobotResponse.class))
                .collect(Collectors.toList());
    }

    // GET BY ID
    public RobotResponse getById(Long id) {

        Robot robot = robotRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new NotFoundException("Robot not found"));

        return modelMapper.map(robot, RobotResponse.class);
    }

    // UPDATE
    public RobotResponse update(Long id, RobotRequest request) {

        Robot robot = robotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Robot not found"));

        robot.setRobotName(request.getRobotName());
        robot.setModel(request.getModel());
        robot.setSerialNumber(request.getSerialNumber());
        robot.setFirmwareVersion(request.getFirmwareVersion());
        robot.setStatus(request.getStatus());

        if (request.getAssignedElderlyId() != null) {
            ElderlyProfile elderly = elderlyProfileRepository
                    .findById(request.getAssignedElderlyId())
                    .orElseThrow(() -> new RuntimeException("Elderly not found"));

            robot.setAssignedElderly(elderly);
        } else {
            robot.setAssignedElderly(null); // unassign
        }

        robotRepository.save(robot);

        return mapToResponse(robot);
    }

    // DELETE (soft delete)
    public void delete(Long id) {

        Robot robot = robotRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new NotFoundException("Robot not found"));

        robot.setDeleted(true);
        robotRepository.save(robot);
    }

    private RobotResponse mapToResponse(Robot robot) {

        RobotResponse response = new RobotResponse();

        response.setId(robot.getId());
        response.setRobotName(robot.getRobotName());
        response.setModel(robot.getModel());
        response.setSerialNumber(robot.getSerialNumber());
        response.setFirmwareVersion(robot.getFirmwareVersion());
        response.setStatus(robot.getStatus());

        if (robot.getAssignedElderly() != null) {
            response.setAssignedElderlyId(robot.getAssignedElderly().getId());
            response.setAssignedElderlyName(robot.getAssignedElderly().getAccount().getFullName());
        }

        return response;
    }
}
