package com.sdplex.egg.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sdplex.egg.domain.User;

/**
 * @author goldbug
 *
 */
public interface UserRepository extends JpaRepository<User, String> {

}
