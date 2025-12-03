package com.vanh.CourseWeb.service.impl;

import com.vanh.CourseWeb.components.JwtTokenUtil;
import com.vanh.CourseWeb.dto.UserDTO;
import com.vanh.CourseWeb.entity.RoleEntity;
import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.exception.DataNotFoundException;
import com.vanh.CourseWeb.exception.PermissionDenyException;
import com.vanh.CourseWeb.repository.AuthRepository;
import com.vanh.CourseWeb.repository.RoleRepository;
import com.vanh.CourseWeb.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor // thay authrided
@Service
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder; // mã hoá pw
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final RoleRepository roleRepository;

    @Override
    public String login(String email, String password) throws Exception {
        Optional<UserEntity> optionalUser = authRepository.findByEmail(email); // ko có option -> .get() ở cuối
        if (optionalUser.isEmpty()) {
            throw new DataNotFoundException("Invalid email / password");
        }

        // return optionalUser.get() -> muốn trả JWT token ?
        UserEntity existingUser = optionalUser.get();

        //check password, và xem có đăng nhập bằng FB, GG ko ?
//        if (existingUser.getFacebookAccountId() == 0
//                && existingUser.getGoogleAccountId() == 0) {
        // giải mã và so sánh
        if (!passwordEncoder.matches(password, existingUser.getPassword())) {
            throw new BadCredentialsException("Wrong email or password");
        }
//        }

        // đăng nhập thành công
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                email, password,
                existingUser.getAuthorities() // lấy danh sách role
        );

        // authenticate with Java Spring security -> Phân quyền từ đây
        // gửi yêu cầu xác thực đến AuthenticationManager.
        authenticationManager.authenticate(authenticationToken);

        // Qua jwtTokenUtil.generateToken xử lý trả token
        return jwtTokenUtil.generateToken(existingUser);
    }

    @Override
    public UserEntity createUser(UserDTO userDTO) throws Exception {
        //register user
        String email = userDTO.getEmail();

        // Kiểm tra xem email đã tồn tại hay chưa
        if (authRepository.existsByEmail(email)) {
            throw new DataIntegrityViolationException("Email đã tồn tại");
        }

        // Chọn vai trò
        RoleEntity roleEntity = roleRepository.findByRoleName(userDTO.getRole().toUpperCase())
                .orElseThrow(() -> new DataNotFoundException("Vai trò không tồn tại"));

        if (roleEntity.getRoleName().toUpperCase().equals(RoleEntity.ADMIN)) {
            throw new PermissionDenyException("Bạn không thể đăng ký vai trò admin");
        }

        // Convert from userDTO => userEntity sử dụng builder pattern
        UserEntity newUser = UserEntity.builder()
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .password(userDTO.getPassword())
                .phoneNumber(userDTO.getPhoneNumber())
                .avatarUrl(userDTO.getAvatarUrl())
                .isActive(1)
//                .facebookAccountId(userDTO.getFacebookAccountId())
//                .googleAccountId(userDTO.getGoogleAccountId())

                .build();

        newUser.setRoleEntity(roleEntity);

        // Kiểm tra nếu có accountId, không yêu cầu password
        if (userDTO.getFacebookAccountId() == 0 && userDTO.getGoogleAccountId() == 0) {
            String password = userDTO.getPassword();
            String encodedPassword = passwordEncoder.encode(password); // Mã hoá pw
            newUser.setPassword(encodedPassword);
        }
        return authRepository.save(newUser);
    }
}
