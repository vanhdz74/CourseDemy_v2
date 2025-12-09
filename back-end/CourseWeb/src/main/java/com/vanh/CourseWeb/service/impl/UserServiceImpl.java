package com.vanh.CourseWeb.service.impl;

import com.vanh.CourseWeb.configurations.MapperConfiguration;
import com.vanh.CourseWeb.dto.UserDTO;
import com.vanh.CourseWeb.dto.UserProfileUpdateDTO;
import com.vanh.CourseWeb.entity.CourseEntity;
import com.vanh.CourseWeb.entity.RoleEntity;
import com.vanh.CourseWeb.entity.UserCourseEntity;
import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.repository.CourseRepository;
import com.vanh.CourseWeb.repository.RoleRepository;
import com.vanh.CourseWeb.repository.UserCourseRepository;
import com.vanh.CourseWeb.repository.UserRepository;
import com.vanh.CourseWeb.service.CloudinaryService;
import com.vanh.CourseWeb.service.UserService;
import com.vanh.CourseWeb.utils.ExtractUtils;
import com.vanh.CourseWeb.utils.FindCourseUtils;
import com.vanh.CourseWeb.utils.FindUserCourseUtils;
import com.vanh.CourseWeb.utils.FindUserUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    private final RoleRepository roleRepository;
    private final CourseRepository courseRepository;
    private final UserCourseRepository userCourseRepository;
    private final MapperConfiguration mapperConfiguration;
    private final CloudinaryService cloudinaryService;

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
                .password(userDTO.getPassword())
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
        user.setIsActive(Integer.parseInt(dto.getIsActive()));
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
        CourseEntity course = FindCourseUtils.getCourseOrThrow(courseRepository, courseId);

        List<UserCourseEntity> userCourseEntities = userCourseRepository.findByCourseEntity_Id(courseId);

        List<UserDTO> result = new ArrayList<>();
        for (UserCourseEntity item : userCourseEntities) {
            UserDTO user = mapperConfiguration.toUserDTO(item.getUserEntity());
            result.add(user);
        }
        return result;
    }

    @Override
    public void addStudentToCourseByEmail(Long courseId, String email) {
        CourseEntity course = FindCourseUtils.getCourseOrThrow(courseRepository, courseId);

        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Email không tồn tại");
        }

        boolean isUserCourse = userCourseRepository.existsByUserEntity_IdAndCourseEntity_Id(user.getId(), courseId);
        if (isUserCourse) {
            throw new RuntimeException("Người dùng đã có trong khoá học này");
        }

        UserCourseEntity userCourseEntity = new UserCourseEntity();
        userCourseEntity.setCourseEntity(course);
        userCourseEntity.setUserEntity(user);

        // Cập nhật số lượng
        course.setQuantity(course.getQuantity() + 1);

        userCourseRepository.save(userCourseEntity);
    }

    @Transactional
    @Override
    public void removeStudentFromCourse(Long courseId, Long userId) {
        FindCourseUtils.getCourseOrThrow(courseRepository, courseId);

        FindUserCourseUtils.getUserCourseOrThrow(userCourseRepository, userId, courseId);

        FindUserUtils.getUserByIdOrThrow(userRepository, userId);

        userCourseRepository.deleteByUserEntity_IdAndCourseEntity_Id(userId, courseId);
    }
}
