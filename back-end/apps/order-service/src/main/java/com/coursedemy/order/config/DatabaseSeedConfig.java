package com.coursedemy.order.config;

import com.coursedemy.order.entity.RoleEntity;
import com.coursedemy.order.entity.UserEntity;
import com.coursedemy.order.repository.RoleRepository;
import com.coursedemy.order.repository.UserRepository;
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

    private static final String TEST_PASSWORD = "123456";

    @Bean
    ApplicationRunner seedDefaultData() {
        return args -> seedRolesAndTestUsers();
    }

    @Transactional
    public void seedRolesAndTestUsers() {
        RoleEntity adminRole = seedRole(RoleEntity.ADMIN, "Quản trị hệ thống");
        RoleEntity teacherRole = seedRole(RoleEntity.TEACHER, "Giảng viên");
        RoleEntity studentRole = seedRole(RoleEntity.STUDENT, "Học viên");

        seedUser("Admin Test", "admin@coursedemy.local", adminRole);
        seedUser("Teacher Test", "teacher@coursedemy.local", teacherRole);
        seedUser("Student Test", "student@coursedemy.local", studentRole);
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
