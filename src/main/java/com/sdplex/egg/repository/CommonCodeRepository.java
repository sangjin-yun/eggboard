package com.sdplex.egg.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sdplex.egg.domain.CommonCode;

public interface CommonCodeRepository extends JpaRepository<CommonCode, Long>{

	void deleteByParentIdx(long parentIdx);

}
