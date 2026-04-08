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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RobotService {

    @Autowired
    RobotRepository robotRepository;

    @Autowired
    ElderlyProfileRepository elderlyProfileRepository;

    @Autowired
    ModelMapper modelMapper;

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${robot.flask.url:http://localhost:5000}")
    private String flaskUrl;

    // CREATE
    public RobotResponse create(RobotRequest request) {

        Robot robot = new Robot();
        robot.setRobotName(request.getRobotName());
        robot.setModel(request.getModel());
        robot.setSerialNumber(request.getSerialNumber());
        robot.setFirmwareVersion(request.getFirmwareVersion());
        robot.setStatus(request.getStatus());


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


        return response;
    }
    // ===== Điều khiển robot (thêm mới) =====
    public Object performAction(String actionName) {
        try {
            String url = flaskUrl + "/robot/action";
            Map<String, String> body = new HashMap<>();
            body.put("action", actionName);
            return restTemplate.postForObject(url, body, Object.class);
        } catch (Exception e) {
            return Map.of("status", "error", "message", e.getMessage());
        }
    }

    public Object performDance(String danceName) {
        try {
            String url = flaskUrl + "/robot/dance";
            Map<String, String> body = new HashMap<>();
            body.put("dance", danceName);
            return restTemplate.postForObject(url, body, Object.class);
        } catch (Exception e) {
            return Map.of("status", "error", "message", e.getMessage());
        }
    }

    public Object getRobotStatus() {
        try {
            String url = flaskUrl + "/robot/status";
            return restTemplate.getForObject(url, Object.class);
        } catch (Exception e) {
            return Map.of("status", "offline", "message", "Flask server không chạy");
        }
    }
}
