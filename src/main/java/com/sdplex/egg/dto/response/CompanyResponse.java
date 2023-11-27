package com.sdplex.egg.dto.response;

import com.sdplex.egg.domain.Company;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CompanyResponse {
    
	private Long companyIdx; // 회사키
	
	private String name; // 회사명
	
	private String alias; // 노출 회사명(비식별 위함)
	
	private String gpYn; // GP구분(Y:선별포장센터 , N:판매장)
	
	private String showYn; // 노출여부(Y:데이터 리스트 노출, N:일반회사)
	
	private String addrSi;
	
	private String addrGu;
	
	private String addrDong;
	
	private String addrDetail;
	
	private String deleteYn;
	
	private String etcInfo;
	
	public CompanyResponse(Long companyIdx,String name,String alias
			,String gpYn, String showYn, String addrSi, String addrGu, String addrDong, String addrDetail
			,String deleteYn, String etcInfo) {
	    this.companyIdx = companyIdx;
	    this.name = name;
        this.alias = alias;
        this.gpYn = gpYn;
        this.showYn = showYn;
        this.addrSi = addrSi;
        this.addrGu = addrGu;
        this.addrDong = addrDong;
        this.addrDetail = addrDetail;
        this.deleteYn = deleteYn;
        this.etcInfo = etcInfo;
	}
	
	public static CompanyResponse from(Company company) {
	    return new CompanyResponse(
	            company.getCompanyIdx()
	            ,company.getName()
	            ,company.getAlias()
	            ,company.getGpYn()
	            ,company.getShowYn()
	            ,company.getAddrSi()
	            ,company.getAddrGu()
	            ,company.getAddrDong()
	            ,company.getAddrDetail()
	            ,company.getDeleteYn()
	            ,company.getEtcInfo()
	            );
	}
}
