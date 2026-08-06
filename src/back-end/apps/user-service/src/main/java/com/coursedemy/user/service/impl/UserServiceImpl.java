package com.coursedemy.user.service.impl;

import com.coursedemy.user.client.CourseFeignClient;
import com.coursedemy.user.dto.request.CourseDTO;
import com.coursedemy.user.mapper.MapperConfiguration;
import com.coursedemy.user.dto.request.UserDTO;
import com.coursedemy.user.dto.request.UserProfileUpdateDTO;
import com.coursedemy.user.entity.RoleEntity;
import com.coursedemy.user.entity.UserCourseEntity;
import com.coursedemy.user.entity.UserEntity;
import com.coursedemy.user.repository.RoleRepository;
import com.coursedemy.user.repository.UserCourseRepository;
import com.coursedemy.user.repository.UserRepository;
import com.coursedemy.user.service.CloudinaryService;
import com.coursedemy.user.service.UserService;
import com.coursedemy.user.util.ExtractUtils;
import com.coursedemy.user.util.FindUserCourseUtils;
import com.coursedemy.user.util.FindUserUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor // thay authrided
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserCourseRepository userCourseRepository;
    private final RoleRepository roleRepository;
    private final MapperConfiguration mapperConfiguration;
    private final CloudinaryService cloudinaryService;
    private final PasswordEncoder passwordEncoder;
    private final CourseFeignClient courseFeignClient;
    @Override
    public List<UserDTO> getAllUsers() {
        List<UserEntity> userEntities = userRepository.findAll();// Tự động trả
//        System.out.println((userEntities.size()));

        List<UserDTO> result = new ArrayList<UserDTO>();
        for (UserEntity item : userEntities) {
            UserDTO user = mapperConfiguration.toUserDTO(item);
            result.add(user);
        }
        return result;
    }

    @Override
    public void addUser(UserDTO userDTO) {
        UserEntity userEntity = userRepository.findByEmail(userDTO.getEmail());
        if (userEntity != null) {
            throw new RuntimeException("Email này đã tồn tại");
        }

        RoleEntity role = roleRepository.findByRoleName(userDTO.getRole())
                .orElseThrow(() -> new RuntimeException("Vai trò không có sẵn"));

        UserEntity user = UserEntity.builder()
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .phoneNumber(userDTO.getPhoneNumber())
                .avatarUrl(userDTO.getAvatarUrl())
                .facebookLink(userDTO.getFacebookLink())
                .youtubeLink(userDTO.getYoutubeLink())
//                .facebookAccountId(userDTO.getFacebookAccountId())
//                .googleAccountId(userDTO.getGoogleAccountId())
                .isActive(1)
                .roleEntity(role)
                .build();

        userRepository.save(user);
    }

    @Override
    public UserProfileUpdateDTO getUserById(Long id) {
        Optional<UserEntity> userEntity = userRepository.findById(id);
        UserProfileUpdateDTO result = new UserProfileUpdateDTO();
        result = mapperConfiguration.toUserProfileUpdateDTO(userEntity.get());
        return result;
    }

    @Override
    public void updateProfileById(Long id, UserProfileUpdateDTO dto) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ngừoi dùng"));

        RoleEntity role = roleRepository.findByRoleName(dto.getRole())
                .orElseThrow(() -> new RuntimeException("Vai trò không có sẵn"));

        // Cập nhật các trường
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAvatarUrl(dto.getAvatarUrl());
        user.setFacebookLink(dto.getFacebookLink());
        user.setYoutubeLink(dto.getYoutubeLink());
        if (Boolean.parseBoolean(dto.getIsActive())) {
            user.setIsActive(1);
        }
        user.setDescription(dto.getDescription());
        user.setRoleEntity(role);

        userRepository.save(user);
    }

    @Override
    public void deleteUserById(@PathVariable Long id) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ngừoi dùng"));

        userEntity.setIsActive(0);
        userRepository.save(userEntity);
    }

    @Override
    public String updateAvatar(Long id, MultipartFile file) throws IOException {
        // 1. Tìm user theo ID
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id: " + id));

        // 2. Xóa avatar cũ nếu có
        if (user.getAvatarUrl() != null && !user.getAvatarUrl().isEmpty()) {
            String publicId = ExtractUtils.extractPublicIdFromUrl(user.getAvatarUrl());
            if (publicId != null) {
                cloudinaryService.deleteFile(publicId);
            }
        }

        // 3. Upload ảnh mới lên Cloudinary
        Map<String, String> uploadResult = cloudinaryService.uploadImage(file);
        String newUrl = uploadResult.get("url");

        // 4. Lưu URL mới vào DB
        user.setAvatarUrl(newUrl);
        userRepository.save(user);

        return newUrl;
    }

    @Override
    public List<UserDTO> getStudentsByCourseId(Long courseId) {

        // Kiểm tra course có tồn tại bên Course-Service
        courseFeignClient.getCourseById(courseId);

        List<UserCourseEntity> userCourseEntities =
                userCourseRepository.findByCourseId(courseId);

        List<UserDTO> result = new ArrayList<>();

        for (UserCourseEntity item : userCourseEntities) {
            UserDTO user = mapperConfiguration.toUserDTO(
                    item.getUserEntity()
            );

            result.add(user);
        }

        return result;
    }

    @Override
    public void addStudentToCourseByEmail(Long courseId, String email) {

        // Gọi Course-Service kiểm tra course tồn tại
        CourseDTO course = courseFeignClient.getCourseById(courseId);

        UserEntity user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("Email không tồn tại");
        }

        boolean isUserCourse =
                userCourseRepository
                        .existsByUserEntity_IdAndCourseId(
                                user.getId(),
                                courseId
                        );

        if (isUserCourse) {
            throw new RuntimeException(
                    "Người dùng đã có trong khoá học này"
            );
        }

        UserCourseEntity userCourseEntity = new UserCourseEntity();

        userCourseEntity.setCourseId(courseId);
        userCourseEntity.setUserEntity(user);

        userCourseRepository.save(userCourseEntity);

        // Gọi Course-Service tăng quantity
        courseFeignClient.increaseQuantity(courseId);
    }

    @Transactional
    @Override
    public void removeStudentFromCourse(
            Long courseId,
            Long userId
    ) {

        // Kiểm tra course tồn tại bên Course-Service
        courseFeignClient.getCourseById(courseId);

        // Kiểm tra user tồn tại
        FindUserUtils.getUserByIdOrThrow(
                userRepository,
                userId
        );

        // Kiểm tra user có trong course không
        FindUserCourseUtils.getUserCourseOrThrow(
                userCourseRepository,
                userId,
                courseId
        );

        // Xóa quan hệ User - Course
        userCourseRepository.deleteByUserEntity_IdAndCourseId(
                userId,
                courseId
        );

        // Giảm quantity bên Course-Service
        courseFeignClient.decreaseQuantity(courseId);
    }

    @Override
    public String getRoleByUserId(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        return user.getRoleEntity().getRoleName();
    }

    @Override
    public List<Long> getCourseIdsByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Không tìm thấy người dùng");
        }
        return userCourseRepository.findByUserEntity_Id(userId).stream()
                .map(UserCourseEntity::getCourseId)
                .toList();
    }
}
