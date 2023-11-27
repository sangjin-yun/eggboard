package com.sdplex.egg.dto.response;

import com.sdplex.egg.domain.HaughUnit;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class HaughUnitResponse {
	
    private Long haughUnitIdx; // 키
	
    private Long sampleOrder;
	
	private Long haughUnitOrder; // 호우유닛 테스트 차수
	
	private Double haughUnitLevel; // 호우유닛 검사 결과
	
	private String deliveryDate; // 시료전달 일시
	
	private String experimenterInfo; // 실험주관자 정보
	
	public HaughUnitResponse(Long haughUnitIdx, Long sampleOrder,Long haughUnitOrder
			, Double haughUnitLevel, String deliveryDate, String experimenterInfo) {
		this.haughUnitIdx = haughUnitIdx;
		this.sampleOrder = sampleOrder;
		this.haughUnitOrder = haughUnitOrder;
		this.haughUnitLevel = haughUnitLevel;
		this.deliveryDate = deliveryDate;
		this.experimenterInfo = experimenterInfo;
	}
	
	public static HaughUnitResponse from(HaughUnit haughUnit) {
		return new HaughUnitResponse(
				haughUnit.getHaughUnitIdx()
				,haughUnit.getSample().getSampleOrder()
				,haughUnit.getHaughUnitOrder()
				,haughUnit.getHaughUnitLevel()
				,haughUnit.getDeliveryDate()
				,haughUnit.getExperimenterInfo()
				);
	}
	
}
