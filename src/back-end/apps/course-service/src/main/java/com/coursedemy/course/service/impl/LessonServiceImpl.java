package com.coursedemy.course.service.impl;

import com.coursedemy.course.client.UserClient;
import com.coursedemy.course.dto.LessonDTO;
import com.coursedemy.course.dto.SubLessonDTO;
import com.coursedemy.course.dto.request.UserDTO;
import com.coursedemy.course.entity.CourseEntity;
import com.coursedemy.course.entity.LessonEntity;
import com.coursedemy.course.entity.SubLessonEntity;
import com.coursedemy.course.mapper.MapperConfiguration;
import com.coursedemy.course.repository.CourseRepository;
import com.coursedemy.course.repository.LessonRepository;
import com.coursedemy.course.repository.SubLessonRepository;
import com.coursedemy.course.service.CloudinaryService;
import com.coursedemy.course.service.LessonService;
import com.coursedemy.course.util.ExtractUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class LessonServiceImpl implements LessonService {
    private final LessonRepository lessonRepository;
    private final SubLessonRepository subLessonRepository;
    private final MapperConfiguration mapperConfiguration;
    private final CloudinaryService cloudinaryService;
    private final CourseRepository courseRepository;
    private final UserClient userClient;

    @Override
    @Transactional(readOnly = true)
    public List<LessonDTO> getLessonsByCourseId(Long courseId) {
        return lessonRepository.findByCourseEntity_IdOrderByOrderIndexAsc(courseId).stream()
                .map(mapperConfiguration::toLessonDTO).toList();
    }

    @Override
    public void createLesson(Long courseId, LessonDTO dto, Long teacherId) {
        CourseEntity course = course(courseId);
        assertOwner(course, teacherId);
        if (blank(dto.getTitle())) throw new IllegalArgumentException("Tiêu đề lesson không được để trống");
        Long max = lessonRepository.findMaxOrderIndexByCourseId(courseId);
        lessonRepository.save(LessonEntity.builder().title(dto.getTitle().trim())
                .orderIndex((max == null ? 0 : max) + 1).courseEntity(course).build());
    }

    @Override
    public void deleteLessonById(Long id, Long teacherId) {
        LessonEntity lesson = lesson(id);
        assertOwner(lesson.getCourseEntity(), teacherId);
        Long courseId = lesson.getCourseEntity().getId();
        Long order = lesson.getOrderIndex();
        lessonRepository.delete(lesson);
        List<LessonEntity> later = lessonRepository.findByCourseEntityIdAndOrderIndexGreaterThan(courseId, order);
        later.forEach(item -> item.setOrderIndex(item.getOrderIndex() - 1));
        lessonRepository.saveAll(later);
    }

    @Override
    public void updateLessonById(Long id, LessonDTO dto, Long teacherId) {
        LessonEntity lesson = lesson(id);
        assertOwner(lesson.getCourseEntity(), teacherId);
        if (blank(dto.getTitle())) throw new IllegalArgumentException("Tiêu đề lesson không được để trống");
        lesson.setTitle(dto.getTitle().trim());
        lessonRepository.save(lesson);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubLessonDTO> getSubLessonsByLessonId(Long id) {
        return subLessonRepository.findByLessonIdOrderByOrderIndexAsc(id).stream()
                .map(mapperConfiguration::toSubLessonDTO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SubLessonDTO getSubLessonById(Long id) { return mapperConfiguration.toSubLessonDTO(subLesson(id)); }

    @Override
    public void createSubLesson(Long lessonId, SubLessonDTO dto, Long teacherId) {
        LessonEntity lesson = lesson(lessonId);
        assertOwner(lesson.getCourseEntity(), teacherId);
        if (blank(dto.getTitle())) throw new IllegalArgumentException("Tiêu đề sublesson không được để trống");
        long next = subLessonRepository.findByLessonIdOrderByOrderIndexAsc(lessonId).stream()
                .map(SubLessonEntity::getOrderIndex).filter(i -> i != null).mapToLong(Long::longValue).max().orElse(0) + 1;
        subLessonRepository.save(SubLessonEntity.builder().title(dto.getTitle().trim()).videoUrl(dto.getVideoUrl())
                .duration(dto.getDuration()).orderIndex(next).lesson(lesson).build());
    }

    @Override
    public String uploadVideo(Long id, MultipartFile file, Long teacherId) throws IOException {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("File video không được để trống");
        SubLessonEntity sub = subLesson(id);
        assertOwner(sub.getLesson().getCourseEntity(), teacherId);
        String oldUrl = sub.getVideoUrl();
        String url = cloudinaryService.uploadVideo(file).get("url");
        if (blank(url)) throw new IOException("Không nhận được URL video từ Cloudinary");
        sub.setVideoUrl(url);
        subLessonRepository.save(sub);
        if (!blank(oldUrl)) { String publicId = ExtractUtils.extractPublicIdFromUrl(oldUrl); if (publicId != null) cloudinaryService.deleteFile(publicId); }
        return url;
    }

    @Override
    public void updateSublessonById(Long id, SubLessonDTO dto, Long teacherId) {
        SubLessonEntity sub = subLesson(id);
        assertOwner(sub.getLesson().getCourseEntity(), teacherId);
        if (dto.getTitle() != null) sub.setTitle(dto.getTitle().trim());
        if (dto.getVideoUrl() != null) sub.setVideoUrl(dto.getVideoUrl());
        if (dto.getDuration() != null) sub.setDuration(dto.getDuration());
        subLessonRepository.save(sub);
    }

    @Override
    public void deleteSubLessonById(Long id, Long teacherId) {
        SubLessonEntity sub = subLesson(id);
        assertOwner(sub.getLesson().getCourseEntity(), teacherId);
        subLessonRepository.delete(sub);
        subLessonRepository.decrementOrderIndexesAfterDelete(sub.getLesson().getId(), sub.getOrderIndex());
    }

    @Override
    public SubLessonEntity addSubLessonRelative(Long lessonId, Long referenceId, boolean after, SubLessonDTO dto, Long teacherId) {
        LessonEntity lesson = lesson(lessonId);
        assertOwner(lesson.getCourseEntity(), teacherId);
        if (referenceId == null) {
            createSubLesson(lessonId, dto, teacherId);
            List<SubLessonEntity> subLessons = subLessonRepository.findByLessonIdOrderByOrderIndexAsc(lessonId);
            return subLessons.get(subLessons.size() - 1);
        }
        SubLessonEntity reference = subLesson(referenceId);
        if (!reference.getLesson().getId().equals(lessonId)) throw new IllegalArgumentException("Sublesson tham chiếu không thuộc lesson này");
        long index = after ? reference.getOrderIndex() + 1 : reference.getOrderIndex();
        subLessonRepository.incrementOrderIndexes(lessonId, index);
        return subLessonRepository.save(SubLessonEntity.builder().title(dto.getTitle()).videoUrl(dto.getVideoUrl())
                .duration(dto.getDuration()).orderIndex(index).lesson(lesson).build());
    }

    @Override public void updateLessonReorder(List<Map<String, Object>> items, Long teacherId) {
        for (Map<String, Object> item : items) { LessonEntity lesson = lesson(id(item)); assertOwner(lesson.getCourseEntity(), teacherId); lesson.setOrderIndex(order(item)); lessonRepository.save(lesson); }
    }
    @Override public void updateSubLessonReorder(List<Map<String, Object>> items, Long teacherId) {
        for (Map<String, Object> item : items) { SubLessonEntity sub = subLesson(id(item)); assertOwner(sub.getLesson().getCourseEntity(), teacherId); sub.setOrderIndex(order(item)); subLessonRepository.save(sub); }
    }
    @Override public List<LessonDTO> getPublicLessons(Long courseId) { return getLessonsByCourseId(courseId); }
    @Override public List<SubLessonDTO> getPublicSubLessons(Long lessonId) {
        return subLessonRepository.findByLessonIdOrderByOrderIndexAsc(lessonId).stream().map(s -> SubLessonDTO.builder().id(s.getId()).title(s.getTitle()).duration(s.getDuration()).orderIndex(s.getOrderIndex()).videoUrl(s.getOrderIndex() == 1 ? s.getVideoUrl() : null).build()).toList();
    }
    private CourseEntity course(Long id) { return courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Khóa học không tồn tại")); }
    private LessonEntity lesson(Long id) { return lessonRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Lesson không tồn tại")); }
    private SubLessonEntity subLesson(Long id) { return subLessonRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Sublesson không tồn tại")); }
    private void assertOwner(CourseEntity course, Long teacherId) {
        UserDTO userDTO=userClient.getUserById(teacherId).getData();
        if (teacherId == null
                || (!teacherId.equals(course.getTeacherId())
                && !"ADMIN".equalsIgnoreCase(userDTO.getRole()))) {

            throw new AccessDeniedException(
                    "Bạn không có quyền chỉnh sửa nội dung khóa học này"
            );
        }
    }
    private static boolean blank(String value) { return value == null || value.isBlank(); }
    private static Long id(Map<String, Object> value) { Object id = value.get("id"); if (id == null) throw new IllegalArgumentException("Thiếu id"); return id instanceof Number n ? n.longValue() : Long.parseLong(id.toString()); }
    private static Long order(Map<String, Object> value) { Object order = value.get("order_index"); if (order == null) throw new IllegalArgumentException("Thiếu order_index"); long result = order instanceof Number n ? n.longValue() : Long.parseLong(order.toString()); if (result < 1) throw new IllegalArgumentException("order_index phải lớn hơn 0"); return result; }
}
