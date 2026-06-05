package com.vanh.CourseWeb.service.impl;

import com.vanh.CourseWeb.components.JwtTokenUtil;
import com.vanh.CourseWeb.components.OtpStorage;
import com.vanh.CourseWeb.dto.UserDTO;
import com.vanh.CourseWeb.dto.response.AuthTokenResponse;
import com.vanh.CourseWeb.entity.RoleEntity;
import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.exception.BusinessException;
import com.vanh.CourseWeb.exception.DataNotFoundException;
import com.vanh.CourseWeb.exception.PermissionDenyException;
import com.vanh.CourseWeb.repository.AuthRepository;
import com.vanh.CourseWeb.repository.RoleRepository;
import com.vanh.CourseWeb.repository.UserRepository;
import com.vanh.CourseWeb.service.AuthService;
import com.vanh.CourseWeb.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;

import java.util.*;

@RequiredArgsConstructor // thay authrided
@Service
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder; // mã hoá pw
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final RoleRepository roleRepository;
    private final OtpStorage otpStorage;
    private final MailService mailService;
    private final UserRepository userRepository;

    @Override
    public AuthTokenResponse login(String email, String password) throws Exception {
        Optional<UserEntity> optionalUser = authRepository.findByEmail(email); // ko có option -> .get() ở cuối
        if (optionalUser.isEmpty()) {
            throw new DataNotFoundException("Invalid email / password");
        }

        // return optionalUser.get() -> muốn trả JWT token ?
        UserEntity existingUser = optionalUser.get();

        //check password, và xem có đăng nhập bằng FB, GG ko ?
//        if (existingUser.getFacebookAccountId() == 0
//                && existingUser.getGoogleAccountId() == 0) {

        String rawPassword = password;

        // giải mã và so sánh
        if (!passwordEncoder.matches(rawPassword, existingUser.getPassword())) {
            throw new BadCredentialsException("Wrong email or password");
        }

//        }

        // đăng nhập thành công
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                email, rawPassword,
                existingUser.getAuthorities() // lấy danh sách role
        );

        // authenticate with Java Spring security -> Phân quyền từ đây
        // gửi yêu cầu xác thực đến AuthenticationManager.
        authenticationManager.authenticate(authenticationToken);

        return buildAuthTokenResponse(existingUser);
    }

    @Override
    public AuthTokenResponse refreshToken(String refreshToken) throws Exception {
        try {
            if (refreshToken == null || refreshToken.isBlank()) {
                throw new BusinessException(HttpStatus.UNAUTHORIZED, "INVALID_REFRESH_TOKEN", "Refresh token không hợp lệ hoặc đã hết hạn");
            }

            String email = jwtTokenUtil.extractEmail(refreshToken);
            UserEntity user = authRepository.findByEmail(email)
                    .orElseThrow(() -> new DataNotFoundException("User không tồn tại"));

            if (!jwtTokenUtil.validateRefreshToken(refreshToken, user)) {
                throw new BusinessException(HttpStatus.UNAUTHORIZED, "INVALID_REFRESH_TOKEN", "Refresh token không hợp lệ hoặc đã hết hạn");
            }

            return buildAuthTokenResponse(user);
        } catch (BusinessException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "INVALID_REFRESH_TOKEN", "Refresh token không hợp lệ hoặc đã hết hạn");
        }
    }

    private AuthTokenResponse buildAuthTokenResponse(UserEntity user) throws Exception {
        return AuthTokenResponse.builder()
                .accessToken(jwtTokenUtil.generateAccessToken(user))
                .refreshToken(jwtTokenUtil.generateRefreshToken(user))
                .tokenType("Bearer")
                .expiresIn(jwtTokenUtil.getAccessExpirationMs() / 1000)
                .build();
    }

    @Override
    public AuthTokenResponse createUser(UserDTO userDTO) throws Exception {
        //register user
        String email = userDTO.getEmail();

        // Kiểm tra xem email đã tồn tại hay chưa
        if (authRepository.existsByEmail(email)) {
            throw new DataIntegrityViolationException("Email đã tồn tại");
        }

        // Chọn vai trò
        RoleEntity roleEntity = roleRepository.findByRoleName(userDTO.getRole().toUpperCase())
                .orElseThrow(() -> new DataNotFoundException("Role không tồn tại"));

        if (roleEntity.getRoleName().toUpperCase().equals(RoleEntity.ADMIN)) {
            throw new PermissionDenyException("You cannot register an admin account");
        }

        String rawPassword = userDTO.getPassword();

        // Convert from userDTO => userEntity sử dụng builder pattern
        UserEntity newUser = UserEntity.builder()
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .password(rawPassword)
                .phoneNumber(userDTO.getPhoneNumber())
                .avatarUrl(userDTO.getAvatarUrl())
                .isActive(1)
//                .facebookAccountId(userDTO.getFacebookAccountId())
//                .googleAccountId(userDTO.getGoogleAccountId())

                .build();

        newUser.setRoleEntity(roleEntity);

        // Kiểm tra nếu có accountId, không yêu cầu password
        if (userDTO.getFacebookAccountId() == 0 && userDTO.getGoogleAccountId() == 0) {

            String encodedPassword = passwordEncoder.encode(rawPassword); // Mã hoá pw
            newUser.setPassword(encodedPassword);
        }
        UserEntity savedUser = authRepository.save(newUser);
        return buildAuthTokenResponse(savedUser);
    }

    private String generateOTP() {
        return String.valueOf((int) (Math.random() * 900000) + 100000); // 6 số
    }

    @Override
    public void sendOtpEmail(String email) {
        UserEntity user = authRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("Email không tồn tại"));

        String otp = generateOTP();

        // Lưu OTP
        otpStorage.storeOtp(email, otp);

        // Gửi email
        mailService.sendOtpEmail(email, otp);
    }

    // random 1 password bất kỳ
    public String generateRandomPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    @Override
    public void verifyOtpAndSendNewPassword(String email, String otp) {
        String storedOtp = otpStorage.getOtp(email);

        if (storedOtp == null) {
            throw new RuntimeException("OTP đã hết hạn hoặc không tồn tại");
        }

        if (!storedOtp.equals(otp)) {
            throw new RuntimeException("OTP sai");
        }

        UserEntity user = authRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        String newPassword = generateRandomPassword();

        user.setPassword(passwordEncoder.encode(newPassword));
        authRepository.save(user);

        otpStorage.clearOtp(email);

        mailService.sendNewPwEmail(
                email, newPassword
        );
    }

    @Override
    public void resetPassword(
            String email,
            String curPassword,
            String password,
            String retypePw
    ) throws Exception {

        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new Exception("Người dùng không tồn tại");
        }

        String rawCurrentPassword = curPassword;

        // Check mật khẩu hiện tại
        if (!passwordEncoder.matches(rawCurrentPassword, user.getPassword())) {
            throw new Exception("Mật khẩu hiện tại nhập vào sai");
        }

        String rawNewPassword = password;
        String rawRetypePassword = retypePw;

        // Check nhập lại
        if (!rawNewPassword.equals(rawRetypePassword)) {
            throw new BadCredentialsException("Mật khẩu không trùng nhau");
        }

        // Không cho trùng mật khẩu cũ
        if (passwordEncoder.matches(rawNewPassword, user.getPassword())) {
            throw new Exception("Mật khẩu mới không được trùng với mật khẩu cũ");
        }

        // Encode & lưu mật khẩu mới
        user.setPassword(passwordEncoder.encode(rawNewPassword));
        authRepository.save(user);
    }

}
