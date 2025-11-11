package com.vanh.CourseWeb.service;

import com.vanh.CourseWeb.dto.LessonDTO;
import com.vanh.CourseWeb.dto.SubLessonDTO;
import jakarta.persistence.metamodel.SingularAttribute;
import org.springframework.data.jpa.domain.AbstractPersistable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.Serializable;
import java.util.List;

public interface LessonService {
    List<LessonDTO> getLessonsByCourseId(Long id);

    List<SubLessonDTO> getSubLessonsByLessonId(Long id);

    String uploadVideo(Long id, MultipartFile file) throws IOException;

    void updateSublessonById(Long id, SubLessonDTO dto);
}
