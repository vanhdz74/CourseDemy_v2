package com.coursedemy.gateway.service.impl;

import com.coursedemy.common.exception.BusinessException;
import com.coursedemy.common.exception.ErrorCode;
import com.coursedemy.gateway.dto.request.UserRegisterRequest;
import com.coursedemy.gateway.dto.response.AuthTokenResponse;
import com.coursedemy.gateway.entity.RoleEntity;
import com.coursedemy.gateway.entity.UserEntity;
import com.coursedemy.gateway.repository.AuthRepository;
import com.coursedemy.gateway.repository.RoleRepository;
import com.coursedemy.gateway.repository.UserRepository;
import com.coursedemy.gateway.service.AuthService;
import com.coursedemy.gateway.service.MailService;
import com.coursedemy.gateway.util.JwtTokenUtil;
import com.coursedemy.gateway.util.OtpStorage;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final RoleRepository roleRepository;
    private final OtpStorage otpStorage;
    private final MailService mailService;
    private final UserRepository userRepository;

    @Override
    public AuthTokenResponse login(String email, String password) {
        Optional<UserEntity> optionalUser = authRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        UserEntity existingUser = optionalUser.get();

        if (!passwordEncoder.matches(password, existingUser.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                email,
                password,
                existingUser.getAuthorities()
        );

        authenticationManager.authenticate(authenticationToken);

        return buildAuthTokenResponse(existingUser);
    }

    @Override
    public AuthTokenResponse refreshToken(String refreshToken) {
        try {
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

    private AuthTokenResponse buildAuthTokenResponse(UserEntity user) {
        return AuthTokenResponse.builder()
                .accessToken(jwtTokenUtil.generateAccessToken(user))
                .refreshToken(jwtTokenUtil.generateRefreshToken(user))
                .tokenType("Bearer")
                .expiresIn(jwtTokenUtil.getAccessExpirationMs() / 1000)
                .build();
    }

    @Override
    public AuthTokenResponse createUser(UserRegisterRequest request) {
        if (!request.getPassword().equals(request.getRetypePassword())) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        String email = request.getEmail();
        if (authRepository.existsByEmail(email)) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        RoleEntity roleEntity = roleRepository.findByRoleName(request.getRole().toUpperCase())
                .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));

        if (roleEntity.getRoleName().toUpperCase().equals(RoleEntity.ADMIN)) {
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
                .build();

        newUser.setRoleEntity(roleEntity);

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

        mailService.sendNewPwEmail(
                email, newPassword
        );
    }

    @Override
    public void resetPassword(
            String email,
            String currentPassword,
            String newPassword,
            String confirmPassword
    ) {

        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BusinessException(ErrorCode.CURRENT_PASSWORD_INCORRECT);
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new BusinessException(ErrorCode.NEW_PASSWORD_SAME_AS_OLD);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        authRepository.save(user);
    }

}
