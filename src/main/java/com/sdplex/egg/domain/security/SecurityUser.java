package com.sdplex.egg.domain.security;

import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.sdplex.egg.domain.User;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

/**
 * @author goldbug
 *
 */
@Getter
@ToString
@EqualsAndHashCode
public class SecurityUser implements UserDetails {

    private static final long serialVersionUID = -2444821347152737183L;

    @EqualsAndHashCode.Exclude
    private User user;

    @Override
    @EqualsAndHashCode.Include
    public String getUsername() {
        return this.user.getUserId();
    }

    @Override
    public String getPassword() {
        return this.user.getPassword();
    }

    @Override
    public Set<GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authority= new HashSet<>();
        authority.add(new SimpleGrantedAuthority(this.user.getRole().toString()));
        return authority;
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

    @Builder
    public SecurityUser(User user) {
        this.user = user;
    }

    public static SecurityUser of(User user) {
        return SecurityUser.builder().user(user).build();
    }

    public String getUserId() {
        return this.getUsername();
    }

}
