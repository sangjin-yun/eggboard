package com.sdplex.egg.dto.response;

import com.sdplex.egg.domain.Germ;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GermResponse {
	
    private Long germIdx; // 키
	
    private Long sampleOrder;
	
	private Long germOrder; // 균 테스트 차수
	
	private String normalLevel; // 일반균 검사 결과
	
	private String salmonellaLevel; // 살모넬라균 검사 결과
	
	private String deliveryDate; // 시료전달 일시
	
	private String experimenterInfo; // 실험주관자 정보
	
	public GermResponse(Long germIdx, Long sampleOrder,Long germOrder
			, String normalLevel, String salmonellaLevel, String deliveryDate, String experimenterInfo) {
		this.germIdx = germIdx;
		this.sampleOrder = sampleOrder;
		this.germOrder = germOrder;
		this.normalLevel = normalLevel;
		this.salmonellaLevel = salmonellaLevel;
		this.deliveryDate = deliveryDate;
		this.experimenterInfo = experimenterInfo;
	}
	
	public static GermResponse from(Germ germ) {
		return new GermResponse(
				germ.getGermIdx()
				,germ.getSample().getSampleOrder()
				,germ.getGermOrder()
				,germ.getNormalLevel()
				,germ.getSalmonellaLevel()
				,germ.getDeliveryDate()
				,germ.getExperimenterInfo()
				);
	}
}
