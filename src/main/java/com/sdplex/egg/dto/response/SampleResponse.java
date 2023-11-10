package com.sdplex.egg.dto.response;

import com.sdplex.egg.domain.Sample;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SampleResponse {
	
	private Long sampleOrder;
	
    private Long companyIdx;
	
	private String washYn; // 세척구분(Y:세척란, N:비세척란)

	private String sampleNumber; // 시료번호
	
	private String eggNumber; // 난각번호
	
	private String spawningDate; // 산란일자(ex:0911)
	
	private String eggGrade; // 계란 등급
	
	private String eggFarmName; // 생산농가명
	
	private String eggFarmAddr; // 생산농가 주소
	
	private Double inTemp; // 내기 온도
	
	private Double inRh; // 내기 습도
	
	private Double deliveryTemp; // 배송팩 온도
	
	private Double deliveryRh; // 배송팩 습도
	
	private String collectionDate; // 시료채취 일시
	
	private String collectionInfo; // 시료 수거자 정보
	
	public SampleResponse(Long sampleOrder,Long companyIdx, String washYn
			, String sampleNumber, String eggNumber, String spawningDate, String eggGrade
			, String eggFarmName, String eggFarmAddr, Double inTemp, Double inRh
			, Double deliveryTemp, Double deliveryRh, String collectionDate, String collectionInfo) {
	    this.sampleOrder = sampleOrder;
	    this.companyIdx = companyIdx;
        this.washYn = washYn;
        this.sampleNumber = sampleNumber;
        this.eggNumber = eggNumber;
        this.spawningDate = spawningDate;
        this.eggGrade = eggGrade;
        this.eggFarmName = eggFarmName;
        this.eggFarmAddr = eggFarmAddr;
        this.inTemp = inTemp;
        this.inRh = inRh;
        this.deliveryTemp = deliveryTemp;
        this.deliveryRh = deliveryRh;
        this.collectionDate = collectionDate;
        this.collectionInfo = collectionInfo;
	}
	
	public static SampleResponse from(Sample sample) {
		return new SampleResponse(
				sample.getSampleOrder()
				,sample.getCompany().getCompanyIdx()
				,sample.getWashYn()
				,sample.getSampleNumber()
				,sample.getEggNumber()
				,sample.getSpawningDate()
				,sample.getEggGrade()
				,sample.getEggFarmName()
				,sample.getEggFarmAddr()
				,sample.getInTemp()
				,sample.getInRh()
				,sample.getDeliveryTemp()
				,sample.getDeliveryRh()
				,sample.getCollectionDate()
				,sample.getCollectionInfo()
				);
	}
	
}
