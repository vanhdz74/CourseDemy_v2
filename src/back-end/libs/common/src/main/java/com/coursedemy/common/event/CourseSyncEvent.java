package com.coursedemy.common.event;

import lombok.*;

import java.io.Serializable;

/**
 * Event được phát bởi course-service khi có thay đổi khóa học.
 * Các service khác lắng nghe Kafka topic này để đồng bộ reference data.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class CourseSyncEvent implements Serializable {

    /** Kafka topic name - tất cả consumer subscribe vào topic này */
    public static final String TOPIC = "course.sync";

    public enum Action {
        CREATED,
        UPDATED,
        DELETED
    }

    private Action action;
    private Long id;
    private String title;
    private Double price;
    private Integer level;
    private Integer quantity;
}
