package com.coursedemy.user.service.impl;

import com.coursedemy.user.dto.request.UserRegisterRequest;
import com.coursedemy.user.dto.response.AuthTokenResponse;
import com.coursedemy.user.entity.RoleEntity;
import com.coursedemy.user.entity.UserEntity;
import com.coursedemy.user.exception.BusinessException;
import com.coursedemy.user.exception.ErrorCode;
import com.coursedemy.user.repository.AuthRepository;
import com.coursedemy.user.repository.RoleRepository;
import com.coursedemy.user.repository.UserRepository;
import com.coursedemy.user.service.AuthService;
import com.coursedemy.user.service.MailService;
import com.coursedemy.user.util.JwtTokenUtil;
import com.coursedemy.user.util.OtpStorage;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final OtpStorage otpStorage;
    private final MailService mailService;

    @Override
    public AuthTokenResponse login(String email, String password) throws Exception {
        Optional<UserEntity> optionalUser = authRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        UserEntity existingUser = optionalUser.get();

        if (!passwordEncoder.matches(password, existingUser.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        return buildAuthTokenResponse(existingUser);
    }

    @Override
    public AuthTokenResponse refreshToken(String refreshToken) throws Exception {
        try {
            if (refreshToken == null || refreshToken.isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN);
            }

            String email = jwtTokenUtil.extractEmail(refreshToken);
            UserEntity user = authRepository.findByEmail(email)
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

            if (!jwtTokenUtil.validateRefreshToken(refreshToken, user)) {
                throw new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN);
            }

            return buildAuthTokenResponse(user);
        } catch (BusinessException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN);
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
    @Transactional
    public AuthTokenResponse createUser(UserRegisterRequest request) throws Exception {
        if (!Objects.equals(request.getPassword(), request.getRetypePassword())) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        String email = request.getEmail();

        if (authRepository.existsByEmail(email)) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        String roleName = (request.getRole() != null && !request.getRole().isBlank()) 
                ? request.getRole().toUpperCase() 
                : "STUDENT";

        RoleEntity roleEntity = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));

        if (RoleEntity.ADMIN.equalsIgnoreCase(roleEntity.getRoleName())) {
            throw new BusinessException(ErrorCode.ADMIN_REGISTER_DENIED);
        }

        String rawPassword = request.getPassword();

        UserEntity newUser = UserEntity.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(rawPassword))
                .phoneNumber(request.getPhoneNumber())
                .avatarUrl(request.getAvatarUrl())
                .isActive(1)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        newUser.setRoleEntity(roleEntity);

        if (request.getFacebookAccountId() == 0 && request.getGoogleAccountId() == 0) {
            String encodedPassword = passwordEncoder.encode(rawPassword);
            newUser.setPassword(encodedPassword);
        }

        UserEntity savedUser = authRepository.save(newUser);
        return buildAuthTokenResponse(savedUser);
    }

    private String generateOTP() {
        return String.valueOf((int) (Math.random() * 900000) + 100000);
    }

    @Override
    public void sendOtpEmail(String email) {
        UserEntity user = authRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.EMAIL_NOT_FOUND));

        String otp = generateOTP();
        otpStorage.storeOtp(email, otp);
        mailService.sendOtpEmail(email, otp);
    }

    public String generateRandomPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    @Override
    @Transactional
    public void verifyOtpAndSendNewPassword(String email, String otp) {
        String storedOtp = otpStorage.getOtp(email);

        if (storedOtp == null) {
            throw new BusinessException(ErrorCode.OTP_EXPIRED_OR_NOT_FOUND);
        }

        if (!storedOtp.equals(otp)) {
            throw new BusinessException(ErrorCode.INVALID_OTP);
        }

        UserEntity user = authRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.EMAIL_NOT_FOUND));

        String newPassword = generateRandomPassword();

        user.setPassword(passwordEncoder.encode(newPassword));
        authRepository.save(user);

        otpStorage.clearOtp(email);
        mailService.sendNewPwEmail(email, newPassword);
    }

    @Override
    @Transactional
    public void resetPassword(
            String email,
            String curPassword,
            String password,
            String retypePw
    ) throws Exception {
        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        if (!passwordEncoder.matches(curPassword, user.getPassword())) {
            throw new BusinessException(ErrorCode.CURRENT_PASSWORD_INCORRECT);
        }

        if (!password.equals(retypePw)) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
            throw new BusinessException(ErrorCode.NEW_PASSWORD_SAME_AS_OLD);
        }

        user.setPassword(passwordEncoder.encode(password));
        authRepository.save(user);
    }
}
