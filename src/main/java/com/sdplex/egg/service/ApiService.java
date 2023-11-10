package com.sdplex.egg.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sdplex.egg.domain.Company;
import com.sdplex.egg.dto.response.CompanyResponse;
import com.sdplex.egg.dto.response.DataLoggerResponse;
import com.sdplex.egg.dto.response.HaughUnitResponse;
import com.sdplex.egg.dto.response.MeteorologicalDataResponse;
import com.sdplex.egg.dto.response.SampleResponse;
import com.sdplex.egg.repository.CompanyRepository;
import com.sdplex.egg.repository.DataLoggerRepository;
import com.sdplex.egg.repository.HaughUnitRepository;
import com.sdplex.egg.repository.MeteorologicalDataRepository;
import com.sdplex.egg.repository.SampleRepository;

import lombok.RequiredArgsConstructor;

/**
 * @author leedk
 *
 */
@Service
@RequiredArgsConstructor
public class ApiService {
	
	private final CompanyRepository companyRepository;
	
	private final SampleRepository sampleRepository;
	
	private final HaughUnitRepository haughUnitRepository;
	
	private final DataLoggerRepository dataLoggerRepository;
	
	private final MeteorologicalDataRepository meteorologicalDataRepository;
	
	public Map<String, Object> dashBoardCompanyList() {
		Map<String, Object> returnMap = new HashMap<>();
		
		List<CompanyResponse> companyList = companyRepository.findAll(Sort.by(Sort.Direction.ASC, "companyIdx"))
				.stream()
				.map(CompanyResponse::from)
				.filter(company -> company.getShowYn().equals("Y"))
				.collect(Collectors.toList());
		returnMap.put("company", companyList);
		
		List<SampleResponse> sampleList = sampleRepository.findAll(Sort.by(Sort.Direction.ASC, "sampleNumber"))
				.stream()
				.map(SampleResponse::from)
				.collect(Collectors.toList());
		returnMap.put("sample", sampleList);
		
		List<HaughUnitResponse> huList = haughUnitRepository.findAll(Sort.by(Sort.Direction.ASC, "haughUnitOrder"))
				.stream()
				.map(HaughUnitResponse::from)
				.collect(Collectors.toList());
		returnMap.put("haughUnit", huList);
		
		
		return returnMap;
	}

	public Map<String, Object> getDashBoardTotalChart() {
		Map<String, Object> returnMap = new HashMap<>();
		
		List<SampleResponse> sampleList = sampleRepository.findAll(Sort.by(Sort.Direction.ASC, "sampleNumber"))
				.stream()
				.map(SampleResponse::from)
				.collect(Collectors.toList());
		returnMap.put("sample", sampleList);
		
		List<HaughUnitResponse> huList = haughUnitRepository.findAll(Sort.by(Sort.Direction.ASC, "haughUnitOrder"))
				.stream()
				.map(HaughUnitResponse::from)
				.collect(Collectors.toList());
		returnMap.put("haughUnit", huList);
		
		List<DataLoggerResponse> loggerList = dataLoggerRepository.findAll(Sort.by(Sort.Direction.ASC, "dataLoggerIdx"))
				.stream()
				.map(DataLoggerResponse::from)
				.collect(Collectors.toList());
		returnMap.put("logger", loggerList);
		
		List<MeteorologicalDataResponse> meteorologicalList = meteorologicalDataRepository.findAll(Sort.by(Sort.Direction.ASC, "idx"))
				.stream()
				.map(MeteorologicalDataResponse::from)
				.filter(meteoro -> meteoro.getAddrSi().equals("경기도") && meteoro.getAddrGu().equals("남양주시") && meteoro.getAddrDong().equals("별내동"))
				.collect(Collectors.toList());
		returnMap.put("meteoro", meteorologicalList);
		
		return returnMap;
	}

	public List<CompanyResponse> getCompanyList() {
		return companyRepository.findAll(Sort.by(Sort.Direction.ASC, "companyIdx"))
				.stream()
				.map(CompanyResponse::from)
				.filter(company -> company.getDeleteYn().equals("N"))
				.collect(Collectors.toList());
	}
	
	@Transactional
	public CompanyResponse companyDelete(Long companyIdx) {
		Company result = companyRepository.findById(companyIdx).get();
		result.setDeleteYn("Y");
		return CompanyResponse.from(result);
	}
	
	@Transactional(readOnly = true)
	public CompanyResponse getCompany(Long companyIdx) {
		return CompanyResponse.from(companyRepository.findById(companyIdx).get());
	}
	
	@Transactional
	public CompanyResponse companySave(Company company) {
		return CompanyResponse.from(companyRepository.save(company));
	}

    
}
