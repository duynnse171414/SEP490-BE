package org.example.exception;

public class ReminderLimitException extends RuntimeException {
    public ReminderLimitException(String message) {
        super(message);
    }
}
