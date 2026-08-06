package com.coursedemy.course.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Data //toString
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTO {
    private Long id;

    @NotEmpty(message = "Category's name cannot be empty")
    private String name;
}
