package com.sdplex.egg.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sdplex.egg.domain.MeteorologicalData;

public interface MeteorologicalDataRepository extends JpaRepository<MeteorologicalData, Long>{

}
