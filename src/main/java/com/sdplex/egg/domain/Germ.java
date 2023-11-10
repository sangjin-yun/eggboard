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
@Table(name = "germ")
public class Germ {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long germIdx; // 키
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sampleOrder", foreignKey = @ForeignKey(name = "germ_fkey_sample"))
    private Sample sample;
	
	@Column(nullable = false)
	private Long germOrder; // 균 테스트 차수
	
	private String normalLevel; // 일반균 검사 결과
	
	private String salmonellaLevel; // 살모넬라균 검사 결과
	
	@Column(nullable = false)
	private String deliveryDate; // 시료전달 일시
	
	private String experimenterInfo; // 실험주관자 정보
	
	@Builder
	public Germ(Map<String, Object> germ, Sample sample) {
		if(!"".equals(String.valueOf(germ.get("germIdx")))) {
            this.germIdx = Long.parseLong(String.valueOf(germ.get("germIdx")));
        }
		this.sample = sample;
		this.germOrder = Long.parseLong(String.valueOf(germ.get("germOrder")));
		this.normalLevel = (String) germ.get("normalLevel");
		this.salmonellaLevel = (String) germ.get("salmonellaLevel");
		this.deliveryDate = (String) germ.get("deliveryDate");
		this.experimenterInfo = (String) germ.get("experimenterInfo");
	}
	
	public static Germ of(Map<String, Object> germ, Sample sample) {
		return Germ.builder().germ(germ).sample(sample).build();
	}
	
}
