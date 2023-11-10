package com.sdplex.egg.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sdplex.egg.domain.Sample;

public interface SampleRepository extends JpaRepository<Sample, Long>{

}
