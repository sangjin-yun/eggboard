package com.sdplex.egg.domain;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.sdplex.egg.dto.request.UserRequest;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * @author lee
 *
 */
@ToString(exclude = {"company"})
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
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "companyIdx", foreignKey = @ForeignKey(name = "user_fkey_company"))
    private Company company;

	public void updateLastLogin() {
	    this.lastLoginAt = LocalDateTime.now();
	}

	@Builder
	public User(String userId, String name, Role role, String password, String orgPassword, Company company) {
	    this.userId = userId;
	    if(StringUtils.isEmpty(password)) {
	        this.password = orgPassword;
	    }else {
	        this.password = new BCryptPasswordEncoder().encode(password);
	    }
	    this.name = name;
	    this.role = role;
	    this.company = company;
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
