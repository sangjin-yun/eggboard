package com.sdplex.egg.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sdplex.egg.domain.Company;

public interface CompanyRepository extends JpaRepository<Company, Long>{

}
