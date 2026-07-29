package com.coursedemy.user.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BusinessException extends RuntimeException {
    private final String code;
    private final HttpStatus status;
    private final Object errors;

    public BusinessException(ErrorCode errorCode) {
        this(errorCode, errorCode.getMessage(), null);
    }

    public BusinessException(ErrorCode errorCode, String message) {
        this(errorCode, message, null);
    }

    public BusinessException(ErrorCode errorCode, Object errors) {
        this(errorCode, errorCode.getMessage(), errors);
    }

    public BusinessException(ErrorCode errorCode, String message, Object errors) {
        this(errorCode.getStatus(), errorCode.getCode(), message, errors);
    }

    public BusinessException(String code, String message) {
        this(HttpStatus.BAD_REQUEST, code, message, null);
    }

    public BusinessException(HttpStatus status, String code, String message) {
        this(status, code, message, null);
    }

    public BusinessException(HttpStatus status, String code, String message, Object errors) {
        super(message);
        this.status = status;
        this.code = code;
        this.errors = errors;
    }
}
