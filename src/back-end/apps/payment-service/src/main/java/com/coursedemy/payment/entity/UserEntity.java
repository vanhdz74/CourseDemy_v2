package com.coursedemy.payment.entity;

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

    @Column(name = "description")
    private String description;

    @Column(name = "facebook_link")
    private String facebookLink;

    @Column(name = "youtube_link")
    private String youtubeLink;

    @Column(name = "is_active")
    private int isActive;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private RoleEntity roleEntity;



    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorityList = new ArrayList<>();
        if (roleEntity != null && roleEntity.getRoleName() != null) {
            String r = roleEntity.getRoleName().toUpperCase().replace("ROLE_", "");
            authorityList.add(new SimpleGrantedAuthority("ROLE_" + r));
            authorityList.add(new SimpleGrantedAuthority(r));
        } else {
            authorityList.add(new SimpleGrantedAuthority("ROLE_STUDENT"));
            authorityList.add(new SimpleGrantedAuthority("STUDENT"));
        }
        return authorityList;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
