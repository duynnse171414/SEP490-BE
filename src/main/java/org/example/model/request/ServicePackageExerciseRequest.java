package org.example.model.request;

import lombok.Data;

import java.util.List;

@Data
public class ServicePackageExerciseRequest {
    private List<Long> exerciseIds;
}