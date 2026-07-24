package com.coursedemy.gateway.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String code;
    private String message;
    private T data;
    private Object errors;
    private Instant timestamp;

    public static <T> ApiResponse<T> ok(T data) {
        return ok("SUCCESS", "Success", data);
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return ok("SUCCESS", message, data);
    }

    public static <T> ApiResponse<T> ok(String code, String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .code(code)
                .message(message)
                .data(data)
                .errors(null)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> created(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .code("CREATED")
                .message(message)
                .data(data)
                .errors(null)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> fail(String code, String message) {
        return fail(code, message, null);
    }

    public static <T> ApiResponse<T> fail(String code, String message, Object errors) {
        return ApiResponse.<T>builder()
                .success(false)
                .code(code)
                .message(message)
                .data(null)
                .errors(errors)
                .timestamp(Instant.now())
                .build();
    }
}
