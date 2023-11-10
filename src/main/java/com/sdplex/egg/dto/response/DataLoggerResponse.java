package com.sdplex.egg.dto.response;

import com.sdplex.egg.domain.DataLogger;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class DataLoggerResponse {
	
    private Long dataLoggerIdx; // 키
	
    private Long companyIdx;
	
	private Long sortOrder; // 차수
	
	private String year;
	
	private String month;
	
	private String day;
	
	private String hour;
	
	private String minute;
	
	private String second;
	
	private Double temp; // 온도
	
	private Double rh; // 습도
	
	
	public DataLoggerResponse(Long dataLoggerIdx, Long companyIdx
			, Long sortOrder, String year, String month, String day
			, String hour, String minute, String second, Double temp, Double rh) {
		this.dataLoggerIdx = dataLoggerIdx;
		this.companyIdx = companyIdx;
		this.sortOrder = sortOrder;
		this.year = year;
		this.month = month;
		this.day = day;
		this.hour = hour;
		this.minute = minute;
		this.second = second;
		this.temp = temp;
		this.rh = rh;
	}
	
	public static DataLoggerResponse from(DataLogger dataLogger) {
		return new DataLoggerResponse(
				dataLogger.getDataLoggerIdx()
				,dataLogger.getCompany().getCompanyIdx()
				,dataLogger.getSortOrder()
				,dataLogger.getYear()
				,dataLogger.getMonth()
				,dataLogger.getDay()
				,dataLogger.getHour()
				,dataLogger.getMinute()
				,dataLogger.getSecond()
				,dataLogger.getTemp()
				,dataLogger.getRh()
				);
	}
}
