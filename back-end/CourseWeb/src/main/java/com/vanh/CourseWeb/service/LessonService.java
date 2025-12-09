package com.vanh.CourseWeb.service;

import com.vanh.CourseWeb.dto.LessonDTO;
import com.vanh.CourseWeb.dto.SubLessonDTO;
import com.vanh.CourseWeb.entity.SubLessonEntity;
import jakarta.persistence.metamodel.SingularAttribute;
import org.springframework.data.jpa.domain.AbstractPersistable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

public interface LessonService {
    List<LessonDTO> getLessonsByCourseId(Long id);

    void createLesson(Long courseId, LessonDTO lessonDTO, Long teacherId);

    void deleteLessonById(Long id);

    void updateLessonById(Long id, LessonDTO lessonDTO);

    List<SubLessonDTO> getSubLessonsByLessonId(Long id);

    void createSubLesson(Long lessonId, SubLessonDTO subLessonDTO, Long teacherId);

    String uploadVideo(Long id, MultipartFile file) throws IOException;

    void updateSublessonById(Long id, SubLessonDTO dto);

    void deleteSubLessonById(Long id, Long teacherId);

    SubLessonEntity addSubLessonRelative(Long lessonId, Long referenceSubLessonId, boolean insertAfter, SubLessonDTO dto, Long teacherId);

    void updateLessonReorder(List<Map<String, Object>> lessonReorder, Long teacherId);

    List<LessonDTO> getPublicLessons(Long courseId);

    List<SubLessonDTO> getPublicSubLessons(Long lessonId);
}
