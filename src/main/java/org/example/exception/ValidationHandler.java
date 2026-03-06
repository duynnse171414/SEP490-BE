package org.example.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice // đánh dấu đây là 1 class để bắt lỗi
public class ValidationHandler {

    // Canh bắt lỗi cho mình
    // MethodArgumentNotValidException => lỗi do thư viện quăng ra

    // nếu gặp lỗi MethodArgumentNotValidException => hàm này sẽ được chạy
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity handleValidation(MethodArgumentNotValidException exception) {

        String message = "";

        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
            message += fieldError.getDefaultMessage() + "\n";
        }

        return new ResponseEntity(message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity handleValidation(Exception exception) {
        return new ResponseEntity(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
