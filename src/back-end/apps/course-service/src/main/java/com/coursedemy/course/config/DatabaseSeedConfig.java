package com.coursedemy.course.config;

import com.coursedemy.course.entity.CategoryEntity;
import com.coursedemy.course.entity.CourseEntity;
import com.coursedemy.course.entity.LessonEntity;
import com.coursedemy.course.entity.SubLessonEntity;
import com.coursedemy.course.repository.CategoryRepository;
import com.coursedemy.course.repository.CourseRepository;
import com.coursedemy.course.repository.LessonRepository;
import com.coursedemy.course.repository.SubLessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DatabaseSeedConfig {

    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final SubLessonRepository subLessonRepository;

    @Bean
    ApplicationRunner seedCourseData() {
        return args -> seedCategoriesAndCourses();
    }

    @Transactional
    public void seedCategoriesAndCourses() {
        CategoryEntity frontend = seedCategory("Frontend Development", "Các khóa học lập trình giao diện người dùng hiện đại");
        CategoryEntity backend = seedCategory("Backend Development", "Các khóa học lập trình máy chủ, cơ sở dữ liệu và API");
        CategoryEntity fullstack = seedCategory("Fullstack Web", "Khóa học kết hợp toàn diện cả Frontend và Backend");
        CategoryEntity mobile = seedCategory("Mobile App Development", "Lập trình ứng dụng di động đa nền tảng Flutter & React Native");
        CategoryEntity devops = seedCategory("DevOps & Cloud", "Kiến trúc hệ thống, Docker, Kubernetes và CI/CD");
        CategoryEntity ai = seedCategory("AI & Data Science", "Trí tuệ nhân tạo, Machine Learning và Khoa học dữ liệu");

        CourseEntity c1 = seedCourse("Lập trình React & Next.js chuyên sâu", "Khóa học làm chủ React 19, Next.js App Router, SSR, TailwindCSS từ cơ bản đến nâng cao.", new BigDecimal("899000"), 1, 120, frontend, 2L);
        CourseEntity c2 = seedCourse("Xây dựng Microservices với Spring Boot & Docker", "Thiết kế hệ thống phân tán, Spring Cloud Gateway, Eureka, Kafka, Docker & PostgreSQL.", new BigDecimal("1299000"), 2, 85, backend, 2L);
        CourseEntity c3 = seedCourse("Mastering Fullstack Web với Next.js & Java", "Lộ trình Fullstack thực chiến từ thiết kế giao diện đến tối ưu hệ thống doanh nghiệp.", new BigDecimal("1599000"), 2, 210, fullstack, 2L);
        seedCourse("Lập trình ứng dụng di động Flutter từ Zero đến Hero", "Xây dựng ứng dụng iOS & Android mượt mà với Flutter và Firebase.", new BigDecimal("799000"), 1, 95, mobile, 2L);
        seedCourse("Docker & Kubernetes cho Developers", "Làm chủ container hóa ứng dụng và triển khai hệ thống quy mô lớn.", new BigDecimal("990000"), 2, 60, devops, 2L);
        seedCourse("Trí tuệ nhân tạo & Prompt Engineering với Python", "Ứng dụng Generative AI, LLMs, LangChain và Python trong các dự án thực tế.", new BigDecimal("1190000"), 1, 150, ai, 2L);

        if (c1 != null && lessonRepository.findByCourseEntity_Id(c1.getId()).isEmpty()) {
            LessonEntity l1 = seedLesson("Chương 1: Giới thiệu & Cài đặt môi trường", 1L, c1);
            seedSubLesson("1.1 Tổng quan về React 19 & Next.js App Router", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", 600L, 1L, l1);
            seedSubLesson("1.2 Thiết lập dự án với TailwindCSS & TypeScript", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", 900L, 2L, l1);

            LessonEntity l2 = seedLesson("Chương 2: React Server Components & Routing", 2L, c1);
            seedSubLesson("2.1 Server Components vs Client Components", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", 1200L, 1L, l2);
            seedSubLesson("2.2 Quản lý State và Data Fetching với Cache", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", 1500L, 2L, l2);

            LessonEntity l3 = seedLesson("Chương 3: Tối ưu hiệu năng & Triển khai", 3L, c1);
            seedSubLesson("3.1 Server Actions & Form Handling", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", 1100L, 1L, l3);
            seedSubLesson("3.2 Deploy ứng dụng lên Vercel & Docker", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4", 1400L, 2L, l3);
        }

        if (c2 != null && lessonRepository.findByCourseEntity_Id(c2.getId()).isEmpty()) {
            LessonEntity l21 = seedLesson("Chương 1: Kiến trúc Microservices phân tán", 1L, c2);
            seedSubLesson("1.1 Phân tích Domain & Thiết kế Service Boundaries", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", 800L, 1L, l21);
            seedSubLesson("1.2 Cấu hình Eureka Discovery & Spring Cloud Gateway", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", 1300L, 2L, l21);
        }
    }

    private CategoryEntity seedCategory(String name, String description) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> categoryRepository.save(CategoryEntity.builder()
                        .name(name)
                        .description(description)
                        .build()));
    }

    private CourseEntity seedCourse(String title, String description, BigDecimal price, int level, int quantity, CategoryEntity category, Long teacherId) {
        CourseEntity course = courseRepository.findByTitle(title);
        if (course == null) {
            course = courseRepository.save(CourseEntity.builder()
                    .title(title)
                    .description(description)
                    .price(price)
                    .level(level)
                    .quantity(quantity)
                    .category(category)
                    .teacherId(teacherId)
                    .createdAt(new Date())
                    .updatedAt(new Date())
                    .build());
        }
        return course;
    }

    private LessonEntity seedLesson(String title, Long orderIndex, CourseEntity course) {
        LessonEntity lesson = LessonEntity.builder()
                .title(title)
                .orderIndex(orderIndex)
                .courseEntity(course)
                .build();
        return lessonRepository.save(lesson);
    }

    private SubLessonEntity seedSubLesson(String title, String videoUrl, Long duration, Long orderIndex, LessonEntity lesson) {
        SubLessonEntity subLesson = SubLessonEntity.builder()
                .title(title)
                .videoUrl(videoUrl)
                .duration(duration)
                .orderIndex(orderIndex)
                .lesson(lesson)
                .build();
        return subLessonRepository.save(subLesson);
    }
}
