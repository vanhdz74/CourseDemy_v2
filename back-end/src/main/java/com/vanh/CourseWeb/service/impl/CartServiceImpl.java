package com.vanh.CourseWeb.service.impl;

import com.vanh.CourseWeb.configurations.MapperConfiguration;
import com.vanh.CourseWeb.dto.CartDTO;
import com.vanh.CourseWeb.dto.CartItemDTO;
import com.vanh.CourseWeb.entity.CartEntity;
import com.vanh.CourseWeb.entity.CartItemEntity;
import com.vanh.CourseWeb.entity.CourseEntity;
import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.repository.CartItemRepository;
import com.vanh.CourseWeb.repository.CartRepository;
import com.vanh.CourseWeb.repository.CourseRepository;
import com.vanh.CourseWeb.repository.UserRepository;
import com.vanh.CourseWeb.service.CartService;
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

    @Override
    public void addToCart(Long userId, Long courseId) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại"));

        CourseEntity courseEntity = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course không tồn tại"));

        // Tìm cart theo user_id
        CartEntity cartEntity = cartRepository.findByUserEntity(userEntity)
                .orElseGet(() -> {
                    CartEntity newCart = new CartEntity();
                    newCart.setUserEntity(userEntity);
                    return cartRepository.save(newCart);
                });

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        CartItemEntity existingItemOpt = cartItemRepository.findByCartEntity_IdAndCourseEntity_Id(cartEntity.getId(), courseId);

        if (existingItemOpt != null) {
            throw new IllegalStateException("Khóa học đã tồn tại trong giỏ hàng!");
        }

        // Nếu ch có
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
        cartDTO.setId(cartEntity.getId());

        // Tìm cart_item theo cart_id
        List<CartItemEntity> cartItemEntities = cartItemRepository.findByCartEntity_Id(cartEntity.getId());

        List<CartItemDTO> cartItemDTOs = new ArrayList<>();
        for (CartItemEntity item : cartItemEntities) {
            CartItemDTO cartItemDTO = mapperConfiguration.toCartItemDTO(item);
            cartItemDTOs.add(cartItemDTO);
        }

        cartDTO.setCartItems(cartItemDTOs);
        return cartDTO;
    }
}
