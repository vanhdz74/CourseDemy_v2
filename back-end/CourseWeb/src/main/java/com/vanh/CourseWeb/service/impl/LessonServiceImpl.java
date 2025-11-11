package com.vanh.CourseWeb.service.impl;

import com.vanh.CourseWeb.configurations.MapperConfiguration;
import com.vanh.CourseWeb.dto.LessonDTO;
import com.vanh.CourseWeb.dto.SubLessonDTO;
import com.vanh.CourseWeb.entity.LessonEntity;
import com.vanh.CourseWeb.entity.SubLessonEntity;
import com.vanh.CourseWeb.repository.LessonRepository;
import com.vanh.CourseWeb.repository.SubLessonRepository;
import com.vanh.CourseWeb.service.CloudinaryService;
import com.vanh.CourseWeb.service.LessonService;
import com.vanh.CourseWeb.utils.ExtractUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor // thay authrided
@Service
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final SubLessonRepository subLessonRepository;
    private final MapperConfiguration mapperConfiguration;
    private final CloudinaryService cloudinaryService;

    @Override
    public List<LessonDTO> getLessonsByCourseId(Long id) {
        List<LessonEntity> lessonEntities = lessonRepository.findByCourseEntity_Id(id);

        List<LessonDTO> result = new ArrayList<>();
        for (LessonEntity item : lessonEntities) {
            LessonDTO lessonDTO = mapperConfiguration.toLessonDTO(item);
            result.add(lessonDTO);
        }
        return result;
    }

    @Override
    public List<SubLessonDTO> getSubLessonsByLessonId(Long id) {
        List<SubLessonEntity> subLessonEntities = subLessonRepository.findByLessonId(id);

        List<SubLessonDTO> result = new ArrayList<>();
        for (SubLessonEntity item : subLessonEntities) {
            SubLessonDTO subLessonDTO = mapperConfiguration.toSubLessonDTO(item);
            result.add(subLessonDTO);
        }
        return result;
    }

    @Override
    public String uploadVideo(Long sublessonId, MultipartFile file) throws IOException {
        // 1
        SubLessonEntity subLessonEntity = subLessonRepository.findById(sublessonId)
                .orElseThrow(() -> new RuntimeException("Bài học không tìm thấy"));

        // 2
        if (subLessonEntity.getVideoUrl() != null && !subLessonEntity.getVideoUrl().isEmpty()) {
            String publicId = ExtractUtils.extractPublicIdFromUrl(subLessonEntity.getVideoUrl());
            if (publicId != null) {
                cloudinaryService.deleteFile(publicId);
            }
        }

        // 3. Upload video mới lên Cloudinary
        Map<String, String> uploadResult = cloudinaryService.uploadVideo(file);
        String newUrl = uploadResult.get("url");

        return newUrl;
    }

    @Override
    public void updateSublessonById(Long id, SubLessonDTO dto) {
        SubLessonEntity subLessonEntity = subLessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bài học không tìm thấy"));

        subLessonEntity.setTitle(dto.getTitle());
        subLessonEntity.setVideoUrl(dto.getVideoUrl());

        ResponseEntity.ok(subLessonRepository.save(subLessonEntity));
    }
}
