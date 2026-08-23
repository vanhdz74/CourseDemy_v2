package com.coursedemy.user.config;

import com.coursedemy.user.entity.RoleEntity;
import com.coursedemy.user.entity.UserEntity;
import com.coursedemy.user.repository.RoleRepository;
import com.coursedemy.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Configuration
@RequiredArgsConstructor
public class DatabaseSeedConfig {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntityManager entityManager;

    private static final String TEST_PASSWORD = "123456";

    @Bean
    ApplicationRunner seedDefaultData() {
        return args -> {
            seedRolesAndTestUsers();
            syncUserSequence();
        };
    }

    @Transactional
    public void seedRolesAndTestUsers() {
        RoleEntity adminRole = seedRole("ADMIN", "Quản trị hệ thống");
        RoleEntity teacherRole = seedRole("TEACHER", "Giảng viên");
        RoleEntity studentRole = seedRole("STUDENT", "Học viên");

        seedUser("Admin Test", "admin@coursedemy.local", adminRole);
        seedUser("Teacher Test", "teacher@coursedemy.local", teacherRole);
        seedUser("Student Test", "student@coursedemy.local", studentRole);
    }

    @Transactional
    public void syncUserSequence() {
        try {
            entityManager.createNativeQuery(
                    "SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users"
            ).getSingleResult();
        } catch (Exception ignored) {
        }
    }

    private RoleEntity seedRole(String roleName, String description) {
        return roleRepository.findByRoleName(roleName)
                .orElseGet(() -> {
                    RoleEntity role = new RoleEntity();
                    role.setRoleName(roleName);
                    role.setDescription(description);
                    return roleRepository.save(role);
                });
    }

    private void seedUser(String username, String email, RoleEntity role) {
        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            user = UserEntity.builder()
                    .email(email)
                    .build();
        }

        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(TEST_PASSWORD));
        user.setIsActive(1);
        user.setRoleEntity(role);

        userRepository.save(user);
    }
}
