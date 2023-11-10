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

/**
 * @author lee
 *
 */
@ToString(exclude = {"company"})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "data_logger")
public class DataLogger {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dataLoggerIdx; // 키
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "companyIdx", foreignKey = @ForeignKey(name = "logger_fkey_company"))
    private Company company;
	
	@Column(nullable = false)
	private Long sortOrder; // 차수
	
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
	public DataLogger(Map<String, Object> dataLogger, Company company) {
		if(!"".equals(String.valueOf(dataLogger.get("dataLoggerIdx")))) {
            this.dataLoggerIdx = Long.parseLong(String.valueOf(dataLogger.get("dataLoggerIdx")));
        }
		this.company = company;
		this.sortOrder = Long.parseLong(String.valueOf(dataLogger.get("sortOrder")));
		this.year = (String) dataLogger.get("year");
		this.month = (String) dataLogger.get("month");
		this.day = (String) dataLogger.get("day");
		this.hour = (String) dataLogger.get("hour");
		this.minute = (String) dataLogger.get("minute");
		this.second = (String) dataLogger.get("second");
		this.temp = Double.parseDouble(String.valueOf(dataLogger.get("temp")));
		this.rh = Double.parseDouble(String.valueOf(dataLogger.get("rh")));
	}
	
	public static DataLogger of(Map<String, Object> dataLogger, Company company) {
		return DataLogger.builder().dataLogger(dataLogger).company(company).build();
	}
}
