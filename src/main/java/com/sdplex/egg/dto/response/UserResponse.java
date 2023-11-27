package com.sdplex.egg.dto.response;

import java.time.LocalDateTime;

import com.sdplex.egg.domain.Role;
import com.sdplex.egg.domain.User;

import lombok.Builder;
import lombok.Getter;

/**
 * @author goldbug
 *
 */
@Getter
public class UserResponse {

	private String userId;

	private String name;

	private String password;

	private LocalDateTime createdDate;

	private LocalDateTime lastLoginAt;

	private Role role;
	@Builder
	public UserResponse(String userId, String name, String password, LocalDateTime createdDate, LocalDateTime lastLoginAt, Role role) {
	    this.userId = userId;
	    this.name = name;
        this.password = password;
        this.createdDate = createdDate;
        this.lastLoginAt = lastLoginAt;
        this.role = role;
	}

	public static UserResponse of(User user) {
	    return UserResponse.builder()
	            .userId(user.getUserId())
	            .name(user.getName())
	            .password(user.getPassword())
	            .createdDate(user.getCreatedAt())
	            .lastLoginAt(user.getLastLoginAt())
	            .role(user.getRole())
	            .build();
	}

}
