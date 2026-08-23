package com.coursedemy.course.event;

import com.coursedemy.common.event.CourseSyncEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

/**
 * Producer: Phát CourseSyncEvent lên Kafka topic "course.sync"
 * mỗi khi khóa học được tạo, cập nhật hoặc xóa.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CourseEventPublisher {

    private final KafkaTemplate<String, CourseSyncEvent> kafkaTemplate;

    public void publish(CourseSyncEvent event) {
        String key = String.valueOf(event.getId()); // Partition by course ID
        CompletableFuture<SendResult<String, CourseSyncEvent>> future =
                kafkaTemplate.send(CourseSyncEvent.TOPIC, key, event);

        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("[Kafka] Failed to publish CourseSyncEvent id={}: {}", event.getId(), ex.getMessage());
            } else {
                log.info("[Kafka] Published CourseSyncEvent action={} id={} -> partition={} offset={}",
                        event.getAction(), event.getId(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            }
        });
    }
}
