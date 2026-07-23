package com.coursedemy.order.config;

import com.coursedemy.order.entity.RoleEntity;
import com.coursedemy.order.entity.UserEntity;
import com.coursedemy.order.repository.RoleRepository;
import com.coursedemy.order.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${app.seed.admin.email:admin@coursedemy.local}")
    private String adminEmail;

    @Value("${app.seed.admin.password:1234}")
    private String adminPassword;

    @Bean
    ApplicationRunner seedDefaultData() {
        return args -> seedRolesAndAdmin();
    }

    @Transactional
    public void seedRolesAndAdmin() {
        RoleEntity adminRole = seedRole(RoleEntity.ADMIN, "Quản trị hệ thống");
        seedRole(RoleEntity.TEACHER, "Giảng viên");
        seedRole(RoleEntity.STUDENT, "Học viên");

        if (userRepository.findByEmail(adminEmail) != null) {
            return;
        }

        UserEntity admin = UserEntity.builder()
                .username("Administrator")
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .isActive(1)
                .roleEntity(adminRole)
                .build();

        userRepository.save(admin);
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
}
