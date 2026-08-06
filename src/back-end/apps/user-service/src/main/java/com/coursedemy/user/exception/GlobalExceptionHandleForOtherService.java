package com.coursedemy.user.exception;

import com.coursedemy.user.dto.response.ApiError;
import com.coursedemy.user.dto.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandleForOtherService {
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(
            BusinessException ex,
            HttpServletRequest request
    ) {
        return build(
                ex.getStatus(),
                ex.getCode(),
                ex.getMessage(),
                ex.getErrors(),
                request
        );
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
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
                request
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
            HttpServletRequest request
    ) {
        return build(
                ErrorCode.BAD_REQUEST,
                ex.getMessage(),
                request
        );
    }


    @ExceptionHandler(DataNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(
            Exception ex,
            HttpServletRequest request
    ) {
        return build(
                ErrorCode.NOT_FOUND,
                ex.getMessage(),
                request
        );
    }


    @ExceptionHandler({
            PermissionDenyException.class,
            AccessDeniedException.class
    })
    public ResponseEntity<ApiResponse<Void>> handleForbidden(
            Exception ex,
            HttpServletRequest request
    ) {
        return build(
                ErrorCode.FORBIDDEN,
                ex.getMessage(),
                request
        );
    }


    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(
            BadCredentialsException ex,
            HttpServletRequest request
    ) {
        return build(
                ErrorCode.INVALID_CREDENTIALS,
                request
        );
    }


    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(
            Exception ex,
            HttpServletRequest request
    ) {
        return build(
                ErrorCode.UNAUTHORIZED,
                ex.getMessage(),
                request
        );
    }


    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(
            DataIntegrityViolationException ex,
            HttpServletRequest request
    ) {
        return build(
                ErrorCode.DATA_INTEGRITY_ERROR,
                request
        );
    }


    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Void>> handleConflict(
            IllegalStateException ex,
            HttpServletRequest request
    ) {
        return build(
                ErrorCode.CONFLICT,
                ex.getMessage(),
                request
        );
    }


    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(
            RuntimeException ex,
            HttpServletRequest request
    ) {
        return build(
                ErrorCode.BUSINESS_ERROR,
                ex.getMessage(),
                request
        );
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(
            Exception ex,
            HttpServletRequest request
    ) {
        log.error(
                "Unhandled exception - path: {}",
                request.getRequestURI(),
                ex
        );
        return build(
                ErrorCode.INTERNAL_SERVER_ERROR,
                request
        );
    }


    // =====================================================
    // BUILD RESPONSE
    // =====================================================

    private ResponseEntity<ApiResponse<Void>> build(
            ErrorCode errorCode,
            HttpServletRequest request
    ) {
        return build(
                errorCode,
                errorCode.getMessage(),
                request
        );
    }


    private ResponseEntity<ApiResponse<Void>> build(
            ErrorCode errorCode,
            String message,
            HttpServletRequest request
    ) {
        return build(
                errorCode.getStatus(),
                errorCode.getCode(),
                message,
                null,
                request
        );
    }


    private ResponseEntity<ApiResponse<Void>> build(
            ErrorCode errorCode,
            Object errors,
            HttpServletRequest request
    ) {
        return build(
                errorCode.getStatus(),
                errorCode.getCode(),
                errorCode.getMessage(),
                errors,
                request
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
            HttpServletRequest request
    ) {

        String path = request.getRequestURI();

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
