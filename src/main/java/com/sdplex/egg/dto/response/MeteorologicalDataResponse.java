package com.sdplex.egg.dto.response;

import com.sdplex.egg.domain.MeteorologicalData;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MeteorologicalDataResponse {
	private Long idx; // 회사키
	
	private String addrSi;
	
	private String addrGu;
	
	private String addrDong;
	
	private String year;
	
	private String month;
	
	private String day;
	
	private String hour;
	
	private String minute;
	
	private String second;
	
	private Double temp; // 온도
	
	private Double rh; // 습도
	
	public MeteorologicalDataResponse(Long idx, String addrSi, String addrGu, String addrDong
			, String year, String month, String day, String hour, String minute
			, String second, Double temp, Double rh) {
		this.idx = idx;
		this.addrSi = addrSi;
		this.addrGu = addrGu;
		this.addrDong = addrDong;
		this.year = year;
		this.month = month;
		this.day = day;
		this.hour = hour;
		this.minute = minute;
		this.second = second;
		this.temp = temp;
		this.rh = rh;
	}
	
	public static MeteorologicalDataResponse from(MeteorologicalData meteorologicalData) {
		return new MeteorologicalDataResponse(
				meteorologicalData.getIdx()
				,meteorologicalData.getAddrSi()
				,meteorologicalData.getAddrGu()
				,meteorologicalData.getAddrDong()
				,meteorologicalData.getYear()
				,meteorologicalData.getMonth()
				,meteorologicalData.getDay()
				,meteorologicalData.getHour()
				,meteorologicalData.getMinute()
				,meteorologicalData.getSecond()
				,meteorologicalData.getTemp()
				,meteorologicalData.getRh()
				);
	}
	
}
