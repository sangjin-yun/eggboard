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
/**
 * @author lee
 *
 */
@ToString
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "common_code")
public class CommonCode extends BaseEntity{

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codeIdx; // 키
	
	@Column(nullable = false)
	private Long parentIdx; // 부모키
	
	@Column(nullable = false)
	private String name; // 명칭
	
	@Column(nullable = false)
	private Long sortOrder; // 순서
	
	@Column(nullable = false, columnDefinition = "varchar(1) default 'N' ")
	private String deleteYn; // 사용여부
	
	@Builder
	public CommonCode(Map<String, Object> code) {
		if(!"".equals(String.valueOf(code.get("codeIdx")))) {
            this.codeIdx = Long.parseLong(String.valueOf(code.get("codeIdx")));
        }
		this.parentIdx = Long.parseLong(String.valueOf(code.get("parentIdx")));
		this.name = (String) code.get("name");
		this.sortOrder = Long.parseLong(String.valueOf(code.get("sortOrder")));
		this.deleteYn = (String) code.get("deleteYn");
	}
	
	public static CommonCode of(Map<String, Object> code) {
		return CommonCode.builder().code(code).build();
	}
	
}
