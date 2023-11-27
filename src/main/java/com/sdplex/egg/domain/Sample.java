package com.sdplex.egg.domain;

import java.util.List;
import java.util.Map;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
@ToString(exclude = {"company"})
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "sample")
public class Sample extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long sampleOrder;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "companyIdx", foreignKey = @ForeignKey(name = "sample_fkey_company"))
    private Company company;
	
	@Column(nullable = false, columnDefinition = "varchar(1)")
	private String washYn; // 세척구분(Y:세척란, N:비세척란)

	@Column(nullable = false)
	private String sampleNumber; // 시료번호
	
	@Column(nullable = false)
	private String eggNumber; // 난각번호
	
	@Column(nullable = false)
	private String spawningDate; // 산란일자(ex:0911)
	
	@Column(nullable = false)
	private String eggGrade; // 계란 등급
	
	@Column(nullable = false)
	private String eggFarmName; // 생산농가명
	
	private String eggFarmAddr; // 생산농가 주소
	
	@Column(nullable = false)
	private Double inTemp; // 내기 온도
	
	@Column(nullable = false)
	private Double inRh; // 내기 습도
	
	private Double deliveryTemp; // 배송팩 온도
	
	private Double deliveryRh; // 배송팩 습도
	
	@Column(nullable = false)
	private String collectionDate; // 시료채취 일시
	
	@Column(nullable = false)
	private String collectionInfo; // 시료 수거자 정보
	
	@OneToMany(mappedBy = "sample", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @OrderBy("germIdx")
    private List<Germ> germs;
	
	@OneToMany(mappedBy = "sample", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @OrderBy("haughUnitIdx")
    private List<HaughUnit> haughUnit;
	
	@Builder
	public Sample(Map<String, Object> sample, Company company) {
		if(null != sample.get("sampleOrder") && !"".equals(String.valueOf(sample.get("sampleOrder")))) {
			this.sampleOrder = Long.parseLong(String.valueOf(sample.get("sampleOrder")));
		}
		this.company = company;
		this.washYn = (String) sample.get("washYn");
		this.sampleNumber = (String) sample.get("sampleNumber");
		this.eggNumber = (String) sample.get("eggNumber");
		this.spawningDate = (String) sample.get("spawningDate");
		this.eggGrade = (String) sample.get("eggGrade");
		this.eggFarmName = (String) sample.get("eggFarmName");
		if(null != sample.get("eggFarmAddr") && !"".equals(String.valueOf(sample.get("eggFarmAddr")))) {
			this.eggFarmAddr = (String) sample.get("eggFarmAddr");
		}
		this.inTemp = Double.parseDouble(String.valueOf(sample.get("inTemp")));
		this.inRh = Double.parseDouble(String.valueOf(sample.get("inRh")));
		if(null != sample.get("deliveryTemp") && !"".equals(String.valueOf(sample.get("deliveryTemp")))) {
			this.deliveryTemp = Double.parseDouble(String.valueOf(sample.get("deliveryTemp")));
		}
		if(null != sample.get("deliveryRh") && !"".equals(String.valueOf(sample.get("deliveryRh")))) {
			this.deliveryRh = Double.parseDouble(String.valueOf(sample.get("deliveryRh")));
		}
		this.collectionDate = (String) sample.get("collectionDate");
		this.collectionInfo = (String) sample.get("collectionInfo");
	}
	
	public static Sample of(Map<String, Object> sample, Company company) {
		return Sample.builder().sample(sample).company(company).build();
	}
	
}
