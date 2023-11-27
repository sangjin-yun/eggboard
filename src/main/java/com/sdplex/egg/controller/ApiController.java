/**
 *
 */
package com.sdplex.egg.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sdplex.egg.domain.Company;
import com.sdplex.egg.domain.User;
import com.sdplex.egg.domain.security.SecurityUser;
import com.sdplex.egg.dto.request.UserRequest;
import com.sdplex.egg.dto.response.CompanyResponse;
import com.sdplex.egg.dto.response.SampleResponse;
import com.sdplex.egg.dto.response.UserResponse;
import com.sdplex.egg.service.ApiService;
import com.sdplex.egg.service.UserService;
import com.sdplex.egg.utility.MessageUtils;

import lombok.RequiredArgsConstructor;

/**
 * @author goldbug
 *
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ApiController {

    private final MessageUtils msgUtils;
    private final UserService userService;
    private final ApiService apiService;
    
    @GetMapping("/dashboard/total")
    public ResponseEntity<Map<String, Object>> getDashBoardTotalChart(@AuthenticationPrincipal SecurityUser user){
        Map<String, Object> result = apiService.getDashBoardTotalChart();
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/sample")
    public ResponseEntity<List<SampleResponse>> getSampleList(@AuthenticationPrincipal SecurityUser user){
        return ResponseEntity.ok(apiService.getSampleList());
    }
    
    @GetMapping("/sample/{sampleOrder}")
    public ResponseEntity<Map<String,Object>> getSample(@AuthenticationPrincipal SecurityUser user
    		, @PathVariable Long sampleOrder){
        return ResponseEntity.ok(apiService.getSample(sampleOrder));
    }
    
    @PostMapping("/sample/save")
    public ResponseEntity<Map<String, Object>> sampleSave(@AuthenticationPrincipal SecurityUser user
    		, @RequestBody Map<String, Object> param){
        return ResponseEntity.ok(apiService.sampleSave(param));
    }
    
    @DeleteMapping("/sample/delete/{sampleOrder}")
    public ResponseEntity<List<SampleResponse>> sampleDelete(@AuthenticationPrincipal SecurityUser user
    		, @PathVariable Long sampleOrder){
        return ResponseEntity.ok(apiService.sampleDelete(sampleOrder));
    }
    
    @GetMapping("/company")
    public ResponseEntity<List<CompanyResponse>> getCompanyList(@AuthenticationPrincipal SecurityUser user){
        return ResponseEntity.ok(apiService.getCompanyList());
    }
    
    @GetMapping("/company/{companyIdx}")
    public ResponseEntity<CompanyResponse> getCompany(@AuthenticationPrincipal SecurityUser user
    		, @PathVariable Long companyIdx){
        return ResponseEntity.ok(apiService.getCompany(companyIdx));
    }
    
    @PostMapping("/company/save")
    public ResponseEntity<CompanyResponse> companySave(@AuthenticationPrincipal SecurityUser user
    		, @RequestBody Company company){
        return ResponseEntity.ok(apiService.companySave(company));
    }
    
    @PostMapping("/company/delete/{companyIdx}")
    public ResponseEntity<CompanyResponse> companyDelete(@AuthenticationPrincipal SecurityUser user
    		, @PathVariable Long companyIdx){
        return ResponseEntity.ok(apiService.companyDelete(companyIdx));
    }
    
    @GetMapping("/userManage")
    public ResponseEntity<List<UserResponse>> getUsers(@AuthenticationPrincipal SecurityUser user){
        List<UserResponse> userList = userService.findAllUsers(user.getUserId());
        return ResponseEntity.ok(userList);
    }
    
    @GetMapping("/userManage/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String userId){
    	UserResponse user = userService.findById(userId);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping("/userManage/make")
    public ResponseEntity<UserRequest> userMake(@RequestBody UserRequest param) {
        boolean user = userService.checkAdmin("admin");
        if(user) {
            userService.save(param);
        }
        return ResponseEntity.ok(param);
    }
    
    @DeleteMapping("/userManage/delete")
    public ResponseEntity<UserResponse> userDelete(@RequestBody UserRequest param, @AuthenticationPrincipal SecurityUser user){
        UserResponse delete = userService.deleteById(param);
        return ResponseEntity.ok(delete);
    }
    
    @PostMapping("/userManage/reset")
    public ResponseEntity<UserResponse> userReset(@RequestBody UserRequest param) {
        UserResponse save = userService.save(param);
        return ResponseEntity.ok(save);
    }

    @PostMapping("/userManage/save")
    public ResponseEntity<UserResponse> userSave(@RequestBody UserRequest param, @AuthenticationPrincipal SecurityUser user) {
        UserResponse save = userService.save(param);
        return ResponseEntity.ok(save);
    }
    
}
