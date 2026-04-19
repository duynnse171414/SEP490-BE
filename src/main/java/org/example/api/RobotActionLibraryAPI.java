package org.example.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.example.entity.RobotActionLibrary;
import org.example.repository.RobotActionLibraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/action-library")
@SecurityRequirement(name = "api")

public class RobotActionLibraryAPI {

    @Autowired
    RobotActionLibraryRepository repo;

    // 🔥 FE lấy list
    @GetMapping
    public List<RobotActionLibrary> getAll() {
        return repo.findAll();
    }

    // 🔥 FE / admin tạo mới
    @PostMapping
    public RobotActionLibrary create(@RequestBody RobotActionLibrary action) {
        return repo.save(action);
    }

    // 🔥 delete (optional)
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}