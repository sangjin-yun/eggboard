package com.sdplex.egg.domain;

import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString(exclude = {"sample"})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "haugh_unit")
public class HaughUnit {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long haughUnitIdx; // 키
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sampleOrder", foreignKey = @ForeignKey(name = "haugh_fkey_sample"))
    private Sample sample;
	
	@Column(nullable = false)
	private Long haughUnitOrder; // 호우유닛 테스트 차수
	
	@Column(nullable = false)
	private Long haughUnitLevel; // 호우유닛 검사 결과
	
	@Column(nullable = false)
	private String deliveryDate; // 시료전달 일시
	
	private String experimenterInfo; // 실험주관자 정보
	
	@Builder
	public HaughUnit(Map<String, Object> haugh, Sample sample) {
		if(!"".equals(String.valueOf(haugh.get("haughUnitIdx")))) {
            this.haughUnitIdx = Long.parseLong(String.valueOf(haugh.get("haughUnitIdx")));
        }
		this.sample = sample;
		this.haughUnitOrder = Long.parseLong(String.valueOf(haugh.get("haughUnitOrder")));
		this.haughUnitLevel = Long.parseLong(String.valueOf(haugh.get("haughUnitLevel")));
		this.deliveryDate = (String) haugh.get("deliveryDate");
		this.experimenterInfo = (String) haugh.get("experimenterInfo");
	}
	
	public static HaughUnit of(Map<String, Object> haugh, Sample sample) {
		return HaughUnit.builder().haugh(haugh).sample(sample).build();
	}
}
