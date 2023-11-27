package com.sdplex.egg.dto.request;

import com.sdplex.egg.domain.Role;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class UserRequest {

    private String userId;
    private String password;
    private String orgPassword;
    private String name;
    private String type;
    private Role role;

}
