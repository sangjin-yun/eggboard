package com.sdplex.egg.domain;

import java.util.List;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author lee
 *
 */
@ToString(exclude = {"dataLoggers","samples"})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "company")
public class Company extends BaseEntity {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long companyIdx; // 회사키
	
	@Column(nullable = false)
	private String name; // 회사명
	
	@Column(nullable = false)
	private String alias; // 노출 회사명(비식별 위함)
	
	@Column(nullable = false, columnDefinition = "varchar(1)")
	private String gpYn; // GP구분(Y:선별포장센터 , N:판매장)
	
	@Column(nullable = false, columnDefinition = "varchar(1)")
	private String showYn; // 노출여부(Y:데이터 리스트 노출, N:일반회사)
	
	//@Column(nullable = false)
	private String addrSi;
	
	//@Column(nullable = false)
	private String addrGu;
	
	//@Column(nullable = false)
	private String addrDong;
	
	private String addrDetail;
	
	@Column(nullable = false, columnDefinition = "varchar(1) defalut 'N")
	private String deleteYn; // 삭제여부
	
	@OneToMany(mappedBy = "company", fetch = FetchType.LAZY)
    @OrderBy("dataLoggerIdx")
    private List<DataLogger> dataLoggers;
	
	@OneToMany(mappedBy = "company", fetch = FetchType.LAZY)
    @OrderBy("sampleOrder")
    private List<Sample> samples;
	
	@Builder
	public Company(Map<String, Object> company) {
		if(null != company.get("companyIdx") && !"".equals(String.valueOf(company.get("companyIdx")))) {
            this.companyIdx = Long.parseLong(String.valueOf(company.get("companyIdx")));
        }
		this.name = (String) company.get("name");
		this.alias = (String) company.get("alias");
		this.gpYn = (String) company.get("gpYn");
		this.showYn = (String) company.get("showYn");
		this.addrSi = (String) company.get("addrSi");
		this.addrGu = (String) company.get("addrGu");
		this.addrDong = (String) company.get("addrDong");
		this.addrDetail = (String) company.get("addrDetail");
		this.deleteYn = (String) company.get("deleteYn");
	}
	
	public static Company of(Map<String, Object> company) {
		return Company.builder().company(company).build();
	}

}
