/**
 *
 */
package com.sdplex.egg.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.sdplex.egg.service.ApiService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@Tag(name = "메뉴 컨트롤러")
public class MenuController {
	
	private final ApiService apiService;
	
	@GetMapping("/dashboard")
    @Operation(summary = "대시보드")
    public String dashboard(Model model) {
		model.addAttribute("result", apiService.dashBoardCompanyList());
        model.addAttribute("current", "/dashboard");
        return "view/dashboard";
    }
	
    @GetMapping("/code")
    @Operation(summary = "코드관리")
    public String alarmBox(Model model) {
        model.addAttribute("current", "/code");
        return "view/code";
    }
	
	@GetMapping("/company")
    @Operation(summary = "업체관리")
    public String company(Model model) {
        model.addAttribute("current", "/company");
        return "view/company";
    }

    @GetMapping("/userManage")
    @Operation(summary = "사용자 관리 페이지")
    public String userManage(Model model) {
        model.addAttribute("current", "/userManage");
        return "view/userManage";
    }
    
    
}
