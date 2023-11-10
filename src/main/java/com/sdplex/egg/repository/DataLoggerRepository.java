package com.sdplex.egg.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sdplex.egg.domain.DataLogger;

public interface DataLoggerRepository extends JpaRepository<DataLogger, Long>{

}
