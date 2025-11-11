package com.vanh.CourseWeb.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTO {
    private Integer id;

    @NotEmpty(message = "Category's name cannot be empty")
    private String name;
}
