package com.sdplex.egg.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sdplex.egg.domain.User;
import com.sdplex.egg.domain.security.SecurityUser;
import com.sdplex.egg.dto.request.UserRequest;
import com.sdplex.egg.dto.response.UserResponse;
import com.sdplex.egg.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * @author goldbug
 *
 */
@RequiredArgsConstructor
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) {
        return SecurityUser.of(this.findByUserId(userId));
    }

    @Transactional(readOnly = true)
    public User findByUserId(String userId) {
        return userRepository.findById(userId)
                             .orElseThrow(() -> new UsernameNotFoundException(userId));
    }

    @Transactional
    public void updateLastLogin(String userId) {
        User user = this.findByUserId(userId);
        user.updateLastLogin();
    }
    
    @Transactional
    public List<UserResponse> findAllUsers(String userId) {
        List<User> users = userRepository.findAll().stream()
                                                  .map(user -> user)
                                                  .collect(Collectors.toCollection(ArrayList::new));

        return new ArrayList<User>(users).stream()
                                         .map(user -> UserResponse.of(user))
                                         .filter(user -> !user.getUserId().equals(userId) && !user.getUserId().equals("admin"))
                                         .sorted((v1, v2) -> v1.getUserId().compareTo(v2.getUserId()))
                                         .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse deleteById(UserRequest param) {
        userRepository.deleteById(param.getUserId());
        return UserResponse.of(User.of(param));
    }

    @Transactional
    public UserResponse save(UserRequest param) {
        return UserResponse.of(userRepository.save(User.of(param)));
    }

    public boolean checkAdmin(String userId) {
        List<User> users = userRepository.findAll().stream()
                .filter(f -> f.getUserId().equals(userId))
                .map(user -> user)
                .collect(Collectors.toCollection(ArrayList::new));

        if(users.size() > 0) {
            return false;
        }else {
            return true;
        }
    }
    
}
