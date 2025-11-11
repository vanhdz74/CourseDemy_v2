package com.vanh.CourseWeb.service.impl;

import com.vanh.CourseWeb.configurations.MapperConfiguration;
import com.vanh.CourseWeb.dto.UserDTO;
import com.vanh.CourseWeb.dto.UserProfileUpdateDTO;
import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.repository.UserRepository;
import com.vanh.CourseWeb.service.CloudinaryService;
import com.vanh.CourseWeb.service.UserService;
import com.vanh.CourseWeb.utils.ExtractUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
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
    public UserProfileUpdateDTO getUserById(Long id) {
        Optional<UserEntity> userEntity = userRepository.findById(id);
        UserProfileUpdateDTO result = new UserProfileUpdateDTO();
        result = mapperConfiguration.toUserProfileUpdateDTO(userEntity.get());
        return result;
    }

    @Override
    public void updateProfileById(Long id, UserProfileUpdateDTO dto) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userEntity.setEmail(dto.getEmail());
        userEntity.setUsername((String) dto.getUsername());
        userEntity.setPhoneNumber(String.valueOf(dto.getPhoneNumber()));
        userEntity.setAvatarUrl((String) dto.getAvatarUrl());
        userEntity.setFacebookLink((String) dto.getFacebookLink());
        userEntity.setYoutubeLink((String) dto.getYoutubeLink());

        ResponseEntity.ok(userRepository.save(userEntity));
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
}
