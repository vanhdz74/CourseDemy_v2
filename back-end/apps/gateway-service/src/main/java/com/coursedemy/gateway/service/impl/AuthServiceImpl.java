package com.coursedemy.gateway.service.impl;

import com.coursedemy.gateway.util.JwtTokenUtil;
import com.coursedemy.gateway.util.OtpStorage;
import com.coursedemy.gateway.dto.request.UserRegisterRequest;
import com.coursedemy.gateway.dto.response.AuthTokenResponse;
import com.coursedemy.gateway.entity.RoleEntity;
import com.coursedemy.gateway.entity.UserEntity;
import com.coursedemy.common.exception.BusinessException;
import com.coursedemy.common.exception.ErrorCode;
import com.coursedemy.gateway.repository.AuthRepository;
import com.coursedemy.gateway.repository.RoleRepository;
import com.coursedemy.gateway.repository.UserRepository;
import com.coursedemy.gateway.service.AuthService;
import com.coursedemy.gateway.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        // return optionalUser.get() -> muốn trả JWT token ?
        UserEntity existingUser = optionalUser.get();

        //check password, và xem có đăng nhập bằng FB, GG ko ?
//        if (existingUser.getFacebookAccountId() == 0
//                && existingUser.getGoogleAccountId() == 0) {

        String rawPassword = password;

        // giải mã và so sánh
        if (!passwordEncoder.matches(rawPassword, existingUser.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
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
    public AuthTokenResponse createUser(UserRegisterRequest request) throws Exception {
        if (!Objects.equals(request.getPassword(), request.getRetypePassword())) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        //register user
        String email = request.getEmail();

        // Kiểm tra xem email đã tồn tại hay chưa
        if (authRepository.existsByEmail(email)) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // Chọn vai trò
        RoleEntity roleEntity = roleRepository.findByRoleName(request.getRole().toUpperCase())
                .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));

        if (roleEntity.getRoleName().toUpperCase().equals(RoleEntity.ADMIN)) {
            throw new BusinessException(ErrorCode.ADMIN_REGISTER_DENIED);
        }

        String rawPassword = request.getPassword();

        // Convert from request => userEntity sử dụng builder pattern
        UserEntity newUser = UserEntity.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(rawPassword))
                .phoneNumber(request.getPhoneNumber())
                .avatarUrl(request.getAvatarUrl())
                .isActive(1)
//                .facebookAccountId(request.getFacebookAccountId())
//                .googleAccountId(request.getGoogleAccountId())

                .build();

        newUser.setRoleEntity(roleEntity);

        // Kiểm tra nếu có accountId, không yêu cầu password
        if (request.getFacebookAccountId() == 0 && request.getGoogleAccountId() == 0) {

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
                .orElseThrow(() -> new BusinessException(ErrorCode.EMAIL_NOT_FOUND));

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
            String curPassword,
            String password,
            String retypePw
    ) throws Exception {

        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        String rawCurrentPassword = curPassword;

        // Check mật khẩu hiện tại
        if (!passwordEncoder.matches(rawCurrentPassword, user.getPassword())) {
            throw new BusinessException(ErrorCode.CURRENT_PASSWORD_INCORRECT);
        }

        String rawNewPassword = password;
        String rawRetypePassword = retypePw;

        // Check nhập lại
        if (!rawNewPassword.equals(rawRetypePassword)) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        // Không cho trùng mật khẩu cũ
        if (passwordEncoder.matches(rawNewPassword, user.getPassword())) {
            throw new BusinessException(ErrorCode.NEW_PASSWORD_SAME_AS_OLD);
        }

        // Encode & lưu mật khẩu mới
        user.setPassword(passwordEncoder.encode(rawNewPassword));
        authRepository.save(user);
    }

}
