package com.sdplex.egg.domain;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.sdplex.egg.dto.request.UserRequest;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * @author lee
 *
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "user_info")
public class User extends BaseEntity {

	@Id
	@Column(nullable = false)
	private String userId;
	
	@Column(nullable = false)
	private String password;

	@Column(nullable = false)
	private String name;

	private LocalDateTime lastLoginAt;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role;
	
	public void updateLastLogin() {
	    this.lastLoginAt = LocalDateTime.now();
	}

	@Builder
	public User(String userId, String name, Role role, String password, String orgPassword) {
	    this.userId = userId;
	    if(StringUtils.isEmpty(password)) {
	        this.password = orgPassword;
	    }else {
	        this.password = new BCryptPasswordEncoder().encode(password);
	    }
	    this.name = name;
	    this.role = role;
	}


	public static User of(UserRequest userRequest) {
	   return User.builder()
	           .userId(userRequest.getUserId())
	           .name(userRequest.getName())
	           .role(userRequest.getRole())
	           .password(userRequest.getPassword())
	           .orgPassword(userRequest.getOrgPassword())
	           .build();
	}

}
