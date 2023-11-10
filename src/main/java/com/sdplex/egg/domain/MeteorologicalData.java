package com.sdplex.egg.domain;

import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "meteorological_data")
public class MeteorologicalData {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idx; // 회사키
	
	@Column(nullable = false)
	private String addrSi;
	
	@Column(nullable = false)
	private String addrGu;
	
	@Column(nullable = false)
	private String addrDong;
	
	@Column(nullable = false)
	private String year;
	
	@Column(nullable = false)
	private String month;
	
	@Column(nullable = false)
	private String day;
	
	@Column(nullable = false)
	private String hour;
	
	@Column(nullable = false)
	private String minute;
	
	@Column(nullable = false)
	private String second;
	
	@Column(nullable = false)
	private Double temp; // 온도
	
	@Column(nullable = false)
	private Double rh; // 습도
	
	@Builder
	public MeteorologicalData(Map<String, Object> meteorologicalData) {
		if(!"".equals(String.valueOf(meteorologicalData.get("idx")))) {
            this.idx = Long.parseLong(String.valueOf(meteorologicalData.get("idx")));
        }
		this.addrSi = (String) meteorologicalData.get("addrSi");
		this.addrGu = (String) meteorologicalData.get("addrGu");
		this.addrDong = (String) meteorologicalData.get("addrDong");
		this.year = (String) meteorologicalData.get("year");
		this.month = (String) meteorologicalData.get("month");
		this.day = (String) meteorologicalData.get("day");
		this.hour = (String) meteorologicalData.get("hour");
		this.minute = (String) meteorologicalData.get("minute");
		this.second = (String) meteorologicalData.get("second");
		this.temp = Double.parseDouble(String.valueOf(meteorologicalData.get("temp")));
		this.rh = Double.parseDouble(String.valueOf(meteorologicalData.get("rh")));
	}
	
	public static MeteorologicalData of(Map<String, Object> meteorologicalData) {
		return MeteorologicalData.builder().meteorologicalData(meteorologicalData).build();
	}
	
}
