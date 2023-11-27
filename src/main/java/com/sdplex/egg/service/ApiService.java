package com.sdplex.egg.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sdplex.egg.domain.Company;
import com.sdplex.egg.domain.Germ;
import com.sdplex.egg.domain.HaughUnit;
import com.sdplex.egg.domain.Sample;
import com.sdplex.egg.dto.response.CompanyResponse;
import com.sdplex.egg.dto.response.DataLoggerResponse;
import com.sdplex.egg.dto.response.GermResponse;
import com.sdplex.egg.dto.response.HaughUnitResponse;
import com.sdplex.egg.dto.response.MeteorologicalDataResponse;
import com.sdplex.egg.dto.response.SampleResponse;
import com.sdplex.egg.repository.CompanyRepository;
import com.sdplex.egg.repository.DataLoggerRepository;
import com.sdplex.egg.repository.GermRepository;
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
	
	private final GermRepository germRepository;
	
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

	public List<SampleResponse> getSampleList() {
		return sampleRepository.findAll(Sort.by(Sort.Direction.ASC, "sampleOrder"))
				.stream()
				.map(SampleResponse::from)
				.collect(Collectors.toList());
	}

	public List<SampleResponse> sampleDelete(Long sampleOrder) {
		sampleRepository.deleteById(sampleOrder);
		return sampleRepository.findAll(Sort.by(Sort.Direction.ASC, "sampleOrder"))
				.stream()
				.map(SampleResponse::from)
				.collect(Collectors.toList());
	}
	
	public Map<String, Object> getSample(Long sampleOrder) {
		Map<String, Object> returnMap = new HashMap<>();
		returnMap.put("sample", SampleResponse.from(sampleRepository.findById(sampleOrder).get()));
		List<HaughUnitResponse> huList = haughUnitRepository.findAll(Sort.by(Sort.Direction.ASC, "haughUnitOrder"))
				.stream()
				.map(HaughUnitResponse::from)
				.filter(haugh -> haugh.getSampleOrder().equals(sampleOrder))
				.collect(Collectors.toList());
		returnMap.put("haughUnit", huList);
		List<GermResponse> germList = germRepository.findAll(Sort.by(Sort.Direction.ASC, "germOrder"))
				.stream()
				.map(GermResponse::from)
				.filter(germ -> germ.getSampleOrder().equals(sampleOrder))
				.collect(Collectors.toList());
		returnMap.put("germ", germList);
		
		return returnMap;
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> sampleSave(Map<String, Object> param) {
		Map<String, Object> sample = (Map<String, Object>) param.get("sample");
		List<Map<String, Object>> haughList = (List<Map<String, Object>>) param.get("haugh");
		List<Map<String, Object>> germList = (List<Map<String, Object>>) param.get("germ");
		
		if(null != String.valueOf(sample.get("sampleOrder")) && !"".equals(String.valueOf(sample.get("sampleOrder")))) {
			sampleRepository.deleteById(Long.parseLong(String.valueOf(sample.get("sampleOrder"))));
		}
		
		Sample result = sampleRepository.save(Sample.of(sample, Company.of(sample)));
		for(Map<String, Object> haugh : haughList) {
			haugh.put("sampleOrder", result.getSampleOrder());
			haughUnitRepository.save(HaughUnit.of(haugh, result));
		}
		for(Map<String, Object> germ : germList) {
			germ.put("sampleOrder", result.getSampleOrder());
			germRepository.save(Germ.of(germ, result));
		}
		
		return param;
	}
	
    
}
