package com.coursedemy.common.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.Collections;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private Integer status;
    private String code;
    private String message;
    private T data;
    private Object errors;
    private String path;
    private Instant timestamp;

    public static <T> ApiResponse<T> ok(T data) {
        return ok("Lấy dữ liệu thành công", data);
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return ok(HttpStatus.OK, message, data);
    }

    public static <T> ApiResponse<T> ok(HttpStatus status, String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .status(status.value())
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> created(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .status(HttpStatus.CREATED.value())
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> fail(String code, String message) {
        return fail(HttpStatus.BAD_REQUEST, code, message, null, Collections.emptyList());
    }

    public static <T> ApiResponse<T> fail(String code, String message, Object errors) {
        return fail(HttpStatus.BAD_REQUEST, code, message, null, errors);
    }

    public static <T> ApiResponse<T> fail(HttpStatus status, String code, String message, String path) {
        return fail(status, code, message, path, Collections.emptyList());
    }

    public static <T> ApiResponse<T> fail(HttpStatus status, String code, String message, String path, Object errors) {
        return ApiResponse.<T>builder()
                .success(false)
                .status(status.value())
                .code(code)
                .message(message)
                .errors(errors == null ? Collections.emptyList() : errors)
                .path(path)
                .timestamp(Instant.now())
                .build();
    }
}
