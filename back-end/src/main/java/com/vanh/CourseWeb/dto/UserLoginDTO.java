package com.vanh.CourseWeb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginDTO {
    // Đăng nhập email, mật khẩu

    // @JsonProperty("email") // nếu tên dưới db khác  thì dùng
    @NotBlank(message = "Phone number is required")
    private String email;

    @NotBlank(message = "Password can not be blank")
    private String password;
}
