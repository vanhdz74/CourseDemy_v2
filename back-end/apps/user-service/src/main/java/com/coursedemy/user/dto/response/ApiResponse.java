package com.coursedemy.user.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;

    private int status;

    private String code;

    private String message;

    private T data;

    private Object errors;

    private String path;

    private Instant timestamp;


    // =========================
    // SUCCESS - 200
    // =========================

    public static <T> ApiResponse<T> ok(T data) {

        return ApiResponse.<T>builder()
                .success(true)
                .status(200)
                .message("Lấy dữ liệu thành công")
                .data(data)
                .timestamp(Instant.now())
                .build();
    }


    public static <T> ApiResponse<T> ok(
            String message,
            T data
    ) {

        return ApiResponse.<T>builder()
                .success(true)
                .status(200)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }


    // =========================
    // CREATED - 201
    // =========================

    public static <T> ApiResponse<T> created(
            String message,
            T data
    ) {

        return ApiResponse.<T>builder()
                .success(true)
                .status(201)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }


    // =========================
    // ERROR
    // =========================

    public static <T> ApiResponse<T> fail(
            String code,
            String message
    ) {

        return ApiResponse.<T>builder()
                .success(false)
                .status(400)
                .code(code)
                .message(message)
                .data(null)
                .errors(null)
                .timestamp(Instant.now())
                .build();
    }


    public static <T> ApiResponse<T> fail(
            String code,
            String message,
            Object errors
    ) {

        return ApiResponse.<T>builder()
                .success(false)
                .status(400)
                .code(code)
                .message(message)
                .data(null)
                .errors(errors)
                .timestamp(Instant.now())
                .build();
    }


    // =========================
    // ERROR WITH STATUS + PATH
    // =========================

    public static <T> ApiResponse<T> fail(
            int status,
            String code,
            String message,
            Object errors,
            String path
    ) {
        return ApiResponse.<T>builder()
                .success(false)
                .status(status)
                .code(code)
                .message(message)
                .data(null)
                .errors(errors)
                .path(path)
                .timestamp(Instant.now())
                .build();
    }
}