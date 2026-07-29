package com.coursedemy.user.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Yêu cầu không hợp lệ"),
    VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "VALIDATION_FAILED", "Dữ liệu không hợp lệ"),
    PASSWORD_MISMATCH(HttpStatus.BAD_REQUEST, "PASSWORD_MISMATCH", "Mật khẩu nhập lại không khớp"),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS", "Email đã tồn tại"),
    DATA_INTEGRITY_ERROR(HttpStatus.CONFLICT, "DATA_INTEGRITY_ERROR", "Dữ liệu bị trùng hoặc không hợp lệ"),
    CONFLICT(HttpStatus.CONFLICT, "CONFLICT", "Dữ liệu xung đột"),

    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Bạn cần đăng nhập để thực hiện thao tác này"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Email hoặc mật khẩu không đúng"),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "INVALID_REFRESH_TOKEN", "Refresh token không hợp lệ hoặc đã hết hạn"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "FORBIDDEN", "Bạn không có quyền thực hiện thao tác này"),
    ADMIN_REGISTER_DENIED(HttpStatus.FORBIDDEN, "ADMIN_REGISTER_DENIED", "Không thể đăng ký tài khoản admin"),

    NOT_FOUND(HttpStatus.NOT_FOUND, "NOT_FOUND", "Không tìm thấy dữ liệu"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "Không tìm thấy người dùng"),
    ROLE_NOT_FOUND(HttpStatus.NOT_FOUND, "ROLE_NOT_FOUND", "Không tìm thấy vai trò"),
    EMAIL_NOT_FOUND(HttpStatus.NOT_FOUND, "EMAIL_NOT_FOUND", "Email không tồn tại"),
    COURSE_NOT_FOUND(HttpStatus.NOT_FOUND, "COURSE_NOT_FOUND", "Không tìm thấy khóa học"),

    UNSUPPORTED_PAYMENT_PROVIDER(HttpStatus.BAD_REQUEST, "UNSUPPORTED_PAYMENT_PROVIDER", "Nhà cung cấp thanh toán không được hỗ trợ"),
    COURSE_ID_EMPTY(HttpStatus.BAD_REQUEST, "COURSE_ID_EMPTY", "Danh sách khóa học không được để trống"),
    INVALID_TOTAL_PRICE(HttpStatus.BAD_REQUEST, "INVALID_TOTAL_PRICE", "Tổng thanh toán không hợp lệ"),

    BUSINESS_ERROR(HttpStatus.BAD_REQUEST, "BUSINESS_ERROR", "Không thể xử lý yêu cầu"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "Có lỗi xảy ra trong hệ thống");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
