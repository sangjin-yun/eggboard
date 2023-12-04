package com.sdplex.egg.dto.response;

import com.sdplex.egg.domain.CommonCode;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommonCodeResponse {
	
    private Long codeIdx; // 키
	
	private Long parentIdx; // 부모키
	
	private String name; // 명칭
	
	private Long sortOrder; // 순서
	
	private String deleteYn; // 사용여부
	
	public CommonCodeResponse(Long codeIdx,Long parentIdx, String name
			, Long sortOrder, String deleteYn) {
	    this.codeIdx = codeIdx;
	    this.parentIdx = parentIdx;
        this.name = name;
        this.sortOrder = sortOrder;
        this.deleteYn = deleteYn;
	}
	
	public static CommonCodeResponse from(CommonCode commCode) {
		return new CommonCodeResponse(
				commCode.getCodeIdx()
				,commCode.getParentIdx()
				,commCode.getName()
				,commCode.getSortOrder()
				,commCode.getDeleteYn()
				);
	}
}
