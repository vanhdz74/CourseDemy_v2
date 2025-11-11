package com.vanh.CourseWeb.service.impl;

import com.vanh.CourseWeb.dto.OrderDTO;
import com.vanh.CourseWeb.entity.*;
import com.vanh.CourseWeb.repository.*;
import com.vanh.CourseWeb.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor // thay authrided
@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final UserCourseRepository userCourseRepository;

    @Override
    public OrderEntity createOrderFromCart(OrderDTO.CheckoutCartDTO request) {
        UserEntity userEntity = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Tính tổng giá
        List<CourseEntity> courseEntities = courseRepository.findAllById(request.getCourseIds());
        double totalPrice = courseEntities.stream()
                .mapToDouble(CourseEntity::getPrice)
                .sum();

        // Tạo đơn hàng
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setUserEntity(userEntity);
        orderEntity.setStatus("PENDING");
        orderEntity.setTotalPrice(totalPrice);
        orderEntity.setPaymentMethod(request.getPaymentMethod());
        orderEntity.setCreatedAt(LocalDateTime.now());
        orderRepository.save(orderEntity);

        // Tạo chi tiết đơn hàng
        for (CourseEntity courseEntity : courseEntities) {
            OrderDetailEntity orderDetailEntity = new OrderDetailEntity();
            orderDetailEntity.setOrderEntity(orderEntity);
            orderDetailEntity.setCourseEntity(courseEntity);
            orderDetailEntity.setPrice(courseEntity.getPrice());
            orderDetailRepository.save(orderDetailEntity);
        }

        return orderEntity;
    }

    @Override
    public void handlePaymentSuccess(Long orderId) {
        OrderEntity orderEntity = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn mua hàng không tìm thấy"));

        // Cập nhật trạng thái PENDING -> PAID
        orderEntity.setStatus("PAID");
        orderRepository.save(orderEntity);

        List<OrderDetailEntity> details = orderDetailRepository.findByOrderEntity_Id(orderId);
        for (OrderDetailEntity detail : details) {
            Long userId = orderEntity.getUserEntity().getId();
            Long courseId = detail.getCourseEntity().getId();

            if (!userCourseRepository.existsByUserEntity_IdAndCourseEntity_Id(userId, courseId)) {
                UserCourseEntity uc = UserCourseEntity.builder()
                        .userEntity(orderEntity.getUserEntity())
                        .courseEntity(detail.getCourseEntity())
                        .build();
                userCourseRepository.save(uc);
            }
        }
    }
}
