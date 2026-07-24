package com.coursedemy.common.exception;

import com.coursedemy.common.dto.response.ApiError;
import com.coursedemy.common.dto.response.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.server.ServerWebExchange;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(
            BusinessException ex,
            ServerWebExchange exchange
    ) {
        return build(
                ex.getStatus(),
                ex.getCode(),
                ex.getMessage(),
                ex.getErrors(),
                exchange
        );
    }


    @ExceptionHandler(WebExchangeBindException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(
            WebExchangeBindException ex,
            ServerWebExchange exchange
    ) {

        List<ApiError> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> ApiError.builder()
                        .field(error.getField())
                        .message(error.getDefaultMessage())
                        .build())
                .toList();

        return build(
                ErrorCode.VALIDATION_FAILED,
                errors,
                exchange
        );
    }


    @ExceptionHandler({
            ConstraintViolationException.class,
            MethodArgumentTypeMismatchException.class,
            IllegalArgumentException.class,
            InvalidParamException.class
    })
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(
            Exception ex,
            ServerWebExchange exchange
    ) {
        return build(
                ErrorCode.BAD_REQUEST,
                ex.getMessage(),
                exchange
        );
    }


    @ExceptionHandler(DataNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(
            Exception ex,
            ServerWebExchange exchange
    ) {
        return build(
                ErrorCode.NOT_FOUND,
                ex.getMessage(),
                exchange
        );
    }


    @ExceptionHandler({
            PermissionDenyException.class,
            AccessDeniedException.class
    })
    public ResponseEntity<ApiResponse<Void>> handleForbidden(
            Exception ex,
            ServerWebExchange exchange
    ) {
        return build(
                ErrorCode.FORBIDDEN,
                ex.getMessage(),
                exchange
        );
    }


    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(
            BadCredentialsException ex,
            ServerWebExchange exchange
    ) {
        return build(
                ErrorCode.INVALID_CREDENTIALS,
                exchange
        );
    }


    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(
            Exception ex,
            ServerWebExchange exchange
    ) {
        return build(
                ErrorCode.UNAUTHORIZED,
                ex.getMessage(),
                exchange
        );
    }


    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(
            DataIntegrityViolationException ex,
            ServerWebExchange exchange
    ) {
        return build(
                ErrorCode.DATA_INTEGRITY_ERROR,
                exchange
        );
    }


    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Void>> handleConflict(
            IllegalStateException ex,
            ServerWebExchange exchange
    ) {
        return build(
                ErrorCode.CONFLICT,
                ex.getMessage(),
                exchange
        );
    }


    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(
            RuntimeException ex,
            ServerWebExchange exchange
    ) {
        return build(
                ErrorCode.BUSINESS_ERROR,
                ex.getMessage(),
                exchange
        );
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(
            Exception ex,
            ServerWebExchange exchange
    ) {
        return build(
                ErrorCode.INTERNAL_SERVER_ERROR,
                exchange
        );
    }


    // =====================================================
    // BUILD RESPONSE
    // =====================================================

    private ResponseEntity<ApiResponse<Void>> build(
            ErrorCode errorCode,
            ServerWebExchange exchange
    ) {
        return build(
                errorCode,
                errorCode.getMessage(),
                exchange
        );
    }


    private ResponseEntity<ApiResponse<Void>> build(
            ErrorCode errorCode,
            String message,
            ServerWebExchange exchange
    ) {
        return build(
                errorCode.getStatus(),
                errorCode.getCode(),
                message,
                null,
                exchange
        );
    }


    private ResponseEntity<ApiResponse<Void>> build(
            ErrorCode errorCode,
            Object errors,
            ServerWebExchange exchange
    ) {
        return build(
                errorCode.getStatus(),
                errorCode.getCode(),
                errorCode.getMessage(),
                errors,
                exchange
        );
    }


    // =====================================================
    // BUILD RESPONSE WITH PATH
    // =====================================================

    private ResponseEntity<ApiResponse<Void>> build(
            HttpStatus status,
            String code,
            String message,
            Object errors,
            ServerWebExchange exchange
    ) {

        // Lấy đường dẫn API hiện tại
        String path = exchange.getRequest()
                .getURI()
                .getPath();

        ApiResponse<Void> response = ApiResponse.fail(
                status.value(),
                code,
                message == null
                        ? status.getReasonPhrase()
                        : message,
                errors,
                path
        );

        return ResponseEntity
                .status(status)
                .body(response);
    }
}