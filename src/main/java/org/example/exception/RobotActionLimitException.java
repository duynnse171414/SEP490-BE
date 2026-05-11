package org.example.exception;

public class RobotActionLimitException extends RuntimeException {
    public RobotActionLimitException(String message) {
        super(message);
    }
}
