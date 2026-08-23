package com.coursedemy.order.service.impl;

import com.coursedemy.order.mapper.MapperConfiguration;
import com.coursedemy.order.dto.CartDTO;
import com.coursedemy.order.dto.CartItemDTO;
import com.coursedemy.order.entity.CartEntity;
import com.coursedemy.order.entity.CartItemEntity;
import com.coursedemy.order.entity.CourseEntity;
import com.coursedemy.order.entity.UserEntity;
import com.coursedemy.order.repository.CartItemRepository;
import com.coursedemy.order.repository.CartRepository;
import com.coursedemy.order.repository.CourseRepository;
import com.coursedemy.order.repository.UserRepository;
import com.coursedemy.order.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MapperConfiguration mapperConfiguration;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @org.springframework.transaction.annotation.Transactional
    @Override
    public void addToCart(Long userId, Long courseId) {
        userRepository.insertUserIfNotExists(userId, "User " + userId, "user" + userId + "@coursedemy.local");
        courseRepository.insertCourseIfNotExists(courseId, "Course " + courseId);

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại"));

        CourseEntity courseEntity = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course không tồn tại"));

        // Tìm cart theo user_id
        CartEntity cartEntity = cartRepository.findByUserEntity_Id(userId);
        if (cartEntity == null) {
            cartEntity = new CartEntity();
            cartEntity.setUserEntity(userEntity);
            cartEntity = cartRepository.save(cartEntity);
        }

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        CartItemEntity existingItemOpt = cartItemRepository.findByCartEntity_IdAndCourseEntity_Id(cartEntity.getId(), courseId);

        if (existingItemOpt != null) {
            throw new IllegalStateException("Khóa học đã tồn tại trong giỏ hàng!");
        }

        // Nếu chưa có
        CartItemEntity newCartItem = new CartItemEntity();
        newCartItem.setCartEntity(cartEntity);
        newCartItem.setCourseEntity(courseEntity);
        cartItemRepository.save(newCartItem);
    }

    @Override
    public void removeFromCart(Long userId, Long courseId) {
        CartEntity cartEntity = cartRepository.findByUserEntity_Id(userId);
        if (cartEntity == null) {
            throw new IllegalArgumentException("Không tìm thấy giỏ hàng của người dùng!");
        }

        CartItemEntity cartItemEntity = cartItemRepository
                .findByCartEntity_IdAndCourseEntity_Id(cartEntity.getId(), courseId);

        if (cartItemEntity == null) {
            throw new IllegalArgumentException("Khóa học không có trong giỏ hàng!");
        }

        cartItemRepository.delete(cartItemEntity);
    }

    @Override
    public CartDTO getCart(Long userId) {
        CartDTO cartDTO = new CartDTO();

        // Tìm cart theo user_id
        CartEntity cartEntity = cartRepository.findByUserEntity_Id(userId);
        if (cartEntity == null) {
            cartDTO.setId(null);
            cartDTO.setCartItems(new ArrayList<>());
            return cartDTO;
        }
        cartDTO.setId(cartEntity.getId());

        // Tìm cart_item theo cart_id
        List<CartItemEntity> cartItemEntities = cartItemRepository.findByCartEntity_Id(cartEntity.getId());

        List<CartItemDTO> cartItemDTOs = new ArrayList<>();
        if (cartItemEntities != null) {
            for (CartItemEntity item : cartItemEntities) {
                CartItemDTO cartItemDTO = mapperConfiguration.toCartItemDTO(item);
                cartItemDTOs.add(cartItemDTO);
            }
        }

        cartDTO.setCartItems(cartItemDTOs);
        return cartDTO;
    }
}
