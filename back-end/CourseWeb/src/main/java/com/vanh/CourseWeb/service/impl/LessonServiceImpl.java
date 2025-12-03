package com.vanh.CourseWeb.service.impl;

import com.vanh.CourseWeb.configurations.MapperConfiguration;
import com.vanh.CourseWeb.dto.LessonDTO;
import com.vanh.CourseWeb.dto.SubLessonDTO;
import com.vanh.CourseWeb.entity.CourseEntity;
import com.vanh.CourseWeb.entity.LessonEntity;
import com.vanh.CourseWeb.entity.SubLessonEntity;
import com.vanh.CourseWeb.repository.CourseRepository;
import com.vanh.CourseWeb.repository.LessonRepository;
import com.vanh.CourseWeb.repository.SubLessonRepository;
import com.vanh.CourseWeb.service.CloudinaryService;
import com.vanh.CourseWeb.service.LessonService;
import com.vanh.CourseWeb.utils.ExtractUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    private final CourseRepository courseRepository;

    @Override
    public List<LessonDTO> getLessonsByCourseId(Long id) {
        List<LessonEntity> lessonEntities = lessonRepository.findByCourseEntity_IdOrderByOrderIndexAsc(id);

        List<LessonDTO> result = new ArrayList<>();
        for (LessonEntity item : lessonEntities) {
            LessonDTO lessonDTO = mapperConfiguration.toLessonDTO(item);
            result.add(lessonDTO);
        }
        return result;
    }

    @Override
    public void createLesson(Long courseId, LessonDTO dto, Long teacherId) {

        CourseEntity courseNow = courseRepository.findById(courseId).orElse(null);

        // Lấy order_index lớn nhất
        Long maxOrder = lessonRepository.findMaxOrderIndexByCourseId(courseId);

        LessonEntity newLes = LessonEntity.builder()
                .title(dto.getTitle())
                .orderIndex(maxOrder + 1)
                .courseEntity(courseNow)
                .build();

        lessonRepository.save(newLes);
    }

    @Override
    public void deleteLessonById(Long id) {
        LessonEntity lessonEntity = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phần này"));

        Long courseId = lessonEntity.getCourseEntity().getId();
        Long deletedOrder = lessonEntity.getOrderIndex();

        // Xoá
        lessonRepository.delete(lessonEntity);

        // Cập nhật các order index phía sau
        List<LessonEntity> lessonsToUpdate = lessonRepository
                .findByCourseEntityIdAndOrderIndexGreaterThan(courseId, deletedOrder);

        for (LessonEntity lesson : lessonsToUpdate) {
            lesson.setOrderIndex(lesson.getOrderIndex() - 1);
        }

        lessonRepository.saveAll(lessonsToUpdate);
    }

    @Override
    public void updateLessonById(Long id, LessonDTO dto) {
        LessonEntity lessonEntity = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phần này"));

        lessonEntity.setTitle(dto.getTitle());
        lessonRepository.save(lessonEntity);
    }

    @Override
    public List<SubLessonDTO> getSubLessonsByLessonId(Long id) {
        List<SubLessonEntity> subLessonEntities = subLessonRepository.findByLessonIdOrderByOrderIndexAsc(id);

        List<SubLessonDTO> result = new ArrayList<>();
        for (SubLessonEntity item : subLessonEntities) {
            SubLessonDTO subLessonDTO = mapperConfiguration.toSubLessonDTO(item);
            result.add(subLessonDTO);
        }
        return result;
    }

    @Override
    public void createSubLesson(Long lessonId, SubLessonDTO subLessonDTO, Long teacherId) {
        LessonEntity lessonEntity = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lesson"));

        SubLessonEntity newSub = SubLessonEntity.builder()
                .title(subLessonDTO.getTitle())
                .videoUrl(subLessonDTO.getVideoUrl())
                .duration(subLessonDTO.getDuration())
                .orderIndex(subLessonDTO.getOrderIndex())
                .lesson(lessonEntity)
                .build();

        // Lưu và trả về
        subLessonRepository.save(newSub);
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

    @Transactional
    @Override
    public void deleteSubLessonById(Long subLessonId, Long currentTeacherId) {
        SubLessonEntity subLesson = subLessonRepository.findById(subLessonId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy subLesson"));

        LessonEntity lesson = subLesson.getLesson();
        CourseEntity course = lesson.getCourseEntity();

        Long ownerTeacherId = course.getUser().getId();

        if (!ownerTeacherId.equals(currentTeacherId)) {
            throw new AccessDeniedException("Bạn không có quyền xóa sublesson này");
        }

        Long lessonId = lesson.getId();
        Long orderIndex = subLesson.getOrderIndex();

        subLessonRepository.delete(subLesson);
        subLessonRepository.decrementOrderIndexesAfterDelete(lessonId, orderIndex);
    }


    @Override
    @Transactional
    public SubLessonEntity addSubLessonRelative(Long lessonId, Long referenceSubLessonId, boolean insertAfter, SubLessonDTO dto, Long currentTeacherId) {
        SubLessonEntity reference = subLessonRepository.findById(referenceSubLessonId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sublesson tham chiếu"));

        LessonEntity lesson = reference.getLesson();
        CourseEntity course = lesson.getCourseEntity();

        Long ownerTeacherId = course.getUser().getId();

        if (!ownerTeacherId.equals(currentTeacherId)) {
            throw new AccessDeniedException("Bạn không có quyền xóa sublesson này");
        }

        Long refIndex = reference.getOrderIndex();
        Long newIndex = insertAfter ? refIndex + 1 : refIndex;

        // Dịch các sublesson phía sau để chừa chỗ
        subLessonRepository.incrementOrderIndexes(lessonId, newIndex);

        // Tạo mới sublesson
        LessonEntity lessonPar = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lesson cha"));

        SubLessonEntity newSub = SubLessonEntity.builder()
                .title(dto.getTitle())
                .videoUrl(dto.getVideoUrl())
                .duration(dto.getDuration())
                .orderIndex(newIndex)
                .lesson(lesson)
                .build();

        return subLessonRepository.save(newSub);
    }

    @Override
    public void updateLessonReorder(List<Map<String, Object>> lessonReorder, Long currentTeacherId) {
        for (Map<String, Object> item : lessonReorder) {
            Object idObj = item.get("id");
            Object orderObj = item.get("order_index");

            if (idObj == null || orderObj == null) continue; // skip nếu thiếu dữ liệu

            Long id = idObj instanceof Number
                    ? ((Number) idObj).longValue()
                    : Long.parseLong(idObj.toString());

            Long orderIndex = orderObj instanceof Number
                    ? ((Number) orderObj).intValue()
                    : Long.parseLong(orderObj.toString());

            lessonRepository.findById(id).ifPresent(lesson -> {
                lesson.setOrderIndex(orderIndex);
                lessonRepository.save(lesson);
            });
        }
    }
}
