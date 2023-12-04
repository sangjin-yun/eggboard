package com.sdplex.egg.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sdplex.egg.domain.CommonCode;
import com.sdplex.egg.domain.Company;
import com.sdplex.egg.domain.Germ;
import com.sdplex.egg.domain.HaughUnit;
import com.sdplex.egg.domain.Sample;
import com.sdplex.egg.dto.response.CommonCodeResponse;
import com.sdplex.egg.dto.response.CompanyResponse;
import com.sdplex.egg.dto.response.DataLoggerResponse;
import com.sdplex.egg.dto.response.GermResponse;
import com.sdplex.egg.dto.response.HaughUnitResponse;
import com.sdplex.egg.dto.response.MeteorologicalDataResponse;
import com.sdplex.egg.dto.response.SampleResponse;
import com.sdplex.egg.repository.CommonCodeRepository;
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
	
	private final CommonCodeRepository commonCodeRepository;
	
	public Map<String, Object> dashBoardCompanyList() {
		Map<String, Object> returnMap = new HashMap<>();
		
		List<CompanyResponse> companyList = companyRepository.findAll(Sort.by(Sort.Direction.ASC, "companyIdx"))
				.stream()
				.map(CompanyResponse::from)
				.filter(company -> company.getShowYn().equals("Y") && company.getDeleteYn().equals("N"))
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
	
	public Map<String, Object> getDashBoardChartSearh(List<String> paramList) {
		Map<String, Object> returnMap = new HashMap<>();
		List<Map<String, Object>> companyTempList = new ArrayList<>();
		List<Map<String, Object>> companyRhList = new ArrayList<>();
		List<Map<String, Object>> sampleTempList = new ArrayList<>();
		List<Map<String, Object>> sampleRhList = new ArrayList<>();
		List<Map<String, Object>> haughList = new ArrayList<>();
		
		for(String param : paramList) {
			String paramType = param.split("-")[0];
			if("sample".equals(paramType)) {
				
			}else if("companyTemp".equals(paramType)) {
				Long companyIdx = Long.parseLong(param.split("-")[1]);
				Long sampleOrder = Long.parseLong(param.split("-")[2]);
				CompanyResponse companyResult = CompanyResponse.from(companyRepository.findById(companyIdx).get());
				SampleResponse sampleResult = SampleResponse.from(sampleRepository.findById(sampleOrder).get());
				List<MeteorologicalDataResponse> meteorologicalList = meteorologicalDataRepository.findAll(Sort.by(Sort.Direction.ASC, "idx"))
						.stream()
						.map(MeteorologicalDataResponse::from)
						.filter(meteoro -> meteoro.getAddrSi().equals(companyResult.getAddrSi()) && meteoro.getAddrGu().equals(companyResult.getAddrGu()) && meteoro.getAddrDong().equals(companyResult.getAddrDong()))
						.collect(Collectors.toList());
				Map<String, Object> addMap = new HashMap<>();
				addMap.put("gubun", sampleResult.getSampleNumber());
				addMap.put("result", meteorologicalList);
				companyTempList.add(addMap);
				
			}else if("companyRh".equals(paramType)) {
				Long companyIdx = Long.parseLong(param.split("-")[1]);
				Long sampleOrder = Long.parseLong(param.split("-")[2]);
				CompanyResponse companyResult = CompanyResponse.from(companyRepository.findById(companyIdx).get());
				SampleResponse sampleResult = SampleResponse.from(sampleRepository.findById(sampleOrder).get());
				List<MeteorologicalDataResponse> meteorologicalList = meteorologicalDataRepository.findAll(Sort.by(Sort.Direction.ASC, "idx"))
						.stream()
						.map(MeteorologicalDataResponse::from)
						.filter(meteoro -> meteoro.getAddrSi().equals(companyResult.getAddrSi()) && meteoro.getAddrGu().equals(companyResult.getAddrGu()) && meteoro.getAddrDong().equals(companyResult.getAddrDong()))
						.collect(Collectors.toList());
				Map<String, Object> addMap = new HashMap<>();
				addMap.put("gubun", sampleResult.getSampleNumber());
				addMap.put("result", meteorologicalList);
				companyRhList.add(addMap);
				
			}else if("sampleTemp".equals(paramType)) {
				Long companyIdx = Long.parseLong(param.split("-")[1]);
				Long sampleOrder = Long.parseLong(param.split("-")[2]);
				CompanyResponse companyResult = CompanyResponse.from(companyRepository.findById(companyIdx).get());
				SampleResponse sampleResult = SampleResponse.from(sampleRepository.findById(sampleOrder).get());
				Map<String, Object> addMap = new HashMap<>();
				addMap.put("gubun", sampleResult.getSampleNumber());
				addMap.put("result", sampleResult);
				sampleTempList.add(addMap);
				
			}else if("sampleRh".equals(paramType)) {
				Long companyIdx = Long.parseLong(param.split("-")[1]);
				Long sampleOrder = Long.parseLong(param.split("-")[2]);
				CompanyResponse companyResult = CompanyResponse.from(companyRepository.findById(companyIdx).get());
				SampleResponse sampleResult = SampleResponse.from(sampleRepository.findById(sampleOrder).get());
				Map<String, Object> addMap = new HashMap<>();
				addMap.put("gubun", sampleResult.getSampleNumber());
				addMap.put("result", sampleResult);
				sampleRhList.add(addMap);
				
			}else if("haugh".equals(paramType)) {
				Long sampleOrder = Long.parseLong(param.split("-")[1]);
				Long haughUnitIdx = Long.parseLong(param.split("-")[2]);
				SampleResponse sampleResult = SampleResponse.from(sampleRepository.findById(sampleOrder).get());
				HaughUnitResponse haughResult = HaughUnitResponse.from(haughUnitRepository.findById(haughUnitIdx).get());
				
				Map<String, Object> addMap = new HashMap<>();
				addMap.put("gubun", sampleResult.getSampleNumber());
				addMap.put("result", haughResult);
				haughList.add(addMap);
				
			}
		}
		
		
		returnMap.put("companyTempList", companyTempList);
		returnMap.put("companyRhList", companyRhList);
		returnMap.put("sampleTempList", sampleTempList);
		returnMap.put("sampleRhList", sampleRhList);
		returnMap.put("haughList", haughList);
		
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

	public List<CommonCodeResponse> getCodeList() {
		return commonCodeRepository.findAll(Sort.by(Sort.Direction.ASC, "codeIdx"))
				.stream()
				.map(CommonCodeResponse::from)
				.filter(comm -> comm.getDeleteYn().equals("N") && comm.getParentIdx() == 0)
				.collect(Collectors.toList());
	}

	public Map<String, Object> getCode(Long codeIdx) {
		Map<String, Object> returnMap = new HashMap<>();
		CommonCodeResponse commResult = CommonCodeResponse.from(commonCodeRepository.findById(codeIdx).get());
		returnMap.put("parentResult", commResult);
		List<CommonCodeResponse> childCodeList = commonCodeRepository.findAll(Sort.by(Sort.Direction.ASC, "sortOrder"))
																			.stream()
																			.map(CommonCodeResponse::from)
																			.filter(comm -> comm.getDeleteYn().equals("N") && comm.getParentIdx().equals(codeIdx))
																			.collect(Collectors.toList());
		returnMap.put("childResult", childCodeList);
		return returnMap;
	}

	@Transactional
	public CommonCodeResponse codeDelete(Long codeIdx) {
		CommonCode result = commonCodeRepository.findById(codeIdx).get();
		result.setDeleteYn("Y");
		return CommonCodeResponse.from(result);
	}

	@SuppressWarnings("unchecked")
	@Transactional
	public Map<String, Object> codeSave(Map<String, Object> param) {
		Map<String, Object> parentCode = (Map<String, Object>) param.get("parentCode");
		
		parentCode.put("name", (String) parentCode.get("parentName"));
		List<Map<String, Object>> childCodeList = (List<Map<String, Object>>) param.get("childCode");
		
		if(null != String.valueOf(parentCode.get("codeIdx")) && !"".equals(String.valueOf(parentCode.get("codeIdx")))) {
			commonCodeRepository.deleteById(Long.parseLong(String.valueOf(parentCode.get("codeIdx"))));
			commonCodeRepository.deleteByParentIdx(Long.parseLong(String.valueOf(parentCode.get("codeIdx"))));
		}
		
		CommonCode result = commonCodeRepository.save(CommonCode.of(parentCode));
		for(Map<String, Object> childCode : childCodeList) {
			childCode.put("parentIdx", result.getCodeIdx());
			childCode.put("deleteYn", "N");
			commonCodeRepository.save(CommonCode.of(childCode));
		}
		
		return param;
	}
    
}
