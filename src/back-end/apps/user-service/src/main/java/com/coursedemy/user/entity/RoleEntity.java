package com.coursedemy.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "roles",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_roles_role_name",
                        columnNames = "role_name"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleEntity {

    public static final String ADMIN = "ADMIN";
    public static final String TEACHER = "TEACHER";
    public static final String STUDENT = "STUDENT";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "role_name",
            nullable = false
    )
    private String roleName;

    @Column(
            name = "description",
            columnDefinition = "TEXT"
    )
    private String description;
}