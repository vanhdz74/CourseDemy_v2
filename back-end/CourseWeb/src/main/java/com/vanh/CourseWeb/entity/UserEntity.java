package com.vanh.CourseWeb.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class UserEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "avatar_url")
    private String avatarUrl;

//    @Column(name = "description")
//    private String description;

    @Column(name = "facebook_link")
    private String facebookLink;

    @Column(name = "youtube_link")
    private String youtubeLink;

    @Column(name = "is_active")
    private int isActive;

//    @Column(name = "facebook_account_id")
//    private int facebookAccountId;
//
//    @Column(name = "google_account_id")
//    private int googleAccountId;

    // Quan he
    @ManyToOne
    @JoinColumn(name = "role_id")
    private RoleEntity roleEntity;

    @OneToOne(mappedBy = "userEntity", cascade = CascadeType.ALL)
    private CartEntity cartEntity;

    // Lấy danh sách role, phải extend UserDetails của security để sử dụng
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorityList = new ArrayList<>();
        // SimpleGrantedAuthority ~ role
        authorityList.add(new SimpleGrantedAuthority("ROLE_" + roleEntity.getRoleName().toUpperCase()));
//        authorityList.add(new SimpleGrantedAuthority("ROLE_USER"));
        return authorityList;
    }
}
