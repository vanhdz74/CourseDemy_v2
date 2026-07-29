package com.coursedemy.course.service;

import com.coursedemy.course.dto.LessonDTO;
import com.coursedemy.course.dto.SubLessonDTO;
import com.coursedemy.course.entity.SubLessonEntity;
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

    void deleteLessonById(Long id, Long teacherId);

    void updateLessonById(Long id, LessonDTO lessonDTO, Long teacherId);

    List<SubLessonDTO> getSubLessonsByLessonId(Long id);

    SubLessonDTO getSubLessonById(Long id);

    void createSubLesson(Long lessonId, SubLessonDTO subLessonDTO, Long teacherId);

    String uploadVideo(Long id, MultipartFile file, Long teacherId) throws IOException;

    void updateSublessonById(Long id, SubLessonDTO dto, Long teacherId);

    void deleteSubLessonById(Long id, Long teacherId);

    SubLessonEntity addSubLessonRelative(Long lessonId, Long referenceSubLessonId, boolean insertAfter, SubLessonDTO dto, Long teacherId);

    void updateLessonReorder(List<Map<String, Object>> lessonReorder, Long teacherId);

    void updateSubLessonReorder(List<Map<String, Object>> subLessonReorder, Long teacherId);

    List<LessonDTO> getPublicLessons(Long courseId);

    List<SubLessonDTO> getPublicSubLessons(Long lessonId);
}
