/**
 *
 */
package com.sdplex.egg.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.sdplex.egg.domain.security.SecurityUser;
import com.sdplex.egg.service.ApiService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * @author goldbug
 * @author leedk
 */
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
	
	@GetMapping("/company")
    @Operation(summary = "업체관리")
    public String company(Model model) {
        model.addAttribute("current", "/company");
        return "view/company";
    }
	
    @GetMapping("/topology")
    @Operation(summary = "토폴로지")
    public String topology(Model model, @AuthenticationPrincipal SecurityUser user) {
        //model.addAttribute("nodeList", nodeService.getNodeMenu());
        model.addAttribute("current", "/topology");
        model.addAttribute("userRole", user.getAuthorities());
        return "view/topology";
    }

    @GetMapping("/groupView")
    @Operation(summary = "노드 그룹 화면")
    public String groupView(Model model) {
        //model.addAttribute("nodeList", nodeService.getNodeMenu());
        model.addAttribute("current", "/groupView");
        return "view/groupView";
    }

    @GetMapping("/group")
    @Operation(summary = "노드 그룹")
    public String group(Model model) {
        //model.addAttribute("nodeList", nodeService.getNodeMenu());
        model.addAttribute("current", "/group");
        return "view/group";
    }

    

    @GetMapping("/node/monitoring/{nodeId}/pipeline")
    @Operation(summary = "한 Node의 모든 pipe 및 pod의 resource를 보여주는 페이지")
    public String overviewPage(Model model, @PathVariable Long nodeId, @AuthenticationPrincipal SecurityUser user) {
        //model.addAttribute("nodeList", nodeService.getNodeMenu());
        model.addAttribute("nodeId", nodeId.toString());
        //model.addAttribute("nodeIpAddress", nodeService.getNodeIpAddress(nodeId));
        //model.addAttribute("nodeCheck", nodeService.checkNode(nodeId));
        model.addAttribute("current", "/node/monitoring/" + nodeId.toString() + "/pipeline");
        model.addAttribute("userRole", user.getAuthorities());
        return "view/pipeline";
    }

    @GetMapping("/node/monitoring/{nodeId}/pod")
    @Operation(summary = "한 Node의 모든 pod를 보여주는 페이지")
    public String podsPage(Model model, @PathVariable Long nodeId) {
        //model.addAttribute("nodeList", nodeService.getNodeMenu());
        model.addAttribute("nodeId", nodeId.toString());
        //model.addAttribute("pipeList", nodeService.findPipesByNodeId(nodeId));
        //model.addAttribute("nodeIpAddress", nodeService.getNodeIpAddress(nodeId));
        //model.addAttribute("nodePodChartMax", nodeService.getNodePodChartMax(nodeId));
        model.addAttribute("current", "/node/monitoring/" + nodeId.toString() + "/pod");
        return "view/pod";
    }

    @GetMapping("/node/monitoring/{nodeId}/image")
    @Operation(summary = "클러스터 내에 image를 보여주는 페이지")
    public String imagesPage(Model model, @PathVariable Long nodeId) {
        //model.addAttribute("nodeList", nodeService.getNodeMenu());
        model.addAttribute("nodeId", nodeId.toString());
        model.addAttribute("current", "/node/monitoring/" + nodeId.toString() + "/image");
        return "view/image";
    }

    @GetMapping("/node/monitoring/{nodeId}/logMonitoring")
    @Operation(summary = "Node 로그 모니터링 페이지")
    public String logMonitoring(Model model, @PathVariable Long nodeId) {
        //model.addAttribute("nodeList", nodeService.getNodeMenu());
        model.addAttribute("nodeId", nodeId.toString());
        model.addAttribute("current", "/node/monitoring/" + nodeId.toString() + "/logMonitoring");
        return "view/logMonitoring";
    }

    @GetMapping("/node/monitoring/{nodeId}/logSearch")
    @Operation(summary = "Node 로그 조회 및 다운로드 페이지")
    public String logSearch(Model model, @PathVariable Long nodeId, @AuthenticationPrincipal SecurityUser user) {
        //model.addAttribute("nodeList", nodeService.getNodeMenu());
        model.addAttribute("nodeId", nodeId.toString());
        model.addAttribute("current", "/node/monitoring/" + nodeId.toString() + "/logSearch");
        model.addAttribute("userRole", user.getAuthorities());
        return "view/logSearch";
    }

    @GetMapping("/actionLog")
    @Operation(summary = "사용자 행동 로그 리스트 페이지")
    public String alarmBox(Model model) {
        //model.addAttribute("nodeList", nodeService.getNodeMenu());
        model.addAttribute("current", "/actionLog");
        return "view/actionLog";
    }

    @GetMapping("/alarmSetting")
    @Operation(summary = "알람 설정 페이지")
    public String alarmSetting(Model model) {
        //model.addAttribute("nodeList", nodeService.getNodeMenu());
        model.addAttribute("current", "/alarmSetting");
        return "view/alarmSetting";
    }

    @GetMapping("/userManage")
    @Operation(summary = "사용자 관리 페이지")
    public String userManage(Model model) {
        //model.addAttribute("nodeList", nodeService.getNodeMenu());
        model.addAttribute("current", "/userManage");
        return "view/userManage";
    }
    
    @GetMapping("/template")
    @Operation(summary = "Toml 파일 템플릿 관리 페이지")
    public String templateManage(Model model) {
        //model.addAttribute("nodeList", nodeService.getNodeMenu());
        model.addAttribute("current", "/template");
        return "view/templateManage";
    }
    
    @GetMapping("/node/configurator/{nodeAlias}/{pipelineName}")
    @Operation(summary = "Pipeline View")
    public String pipelineView(Model model
            , @PathVariable String nodeAlias, @PathVariable String pipelineName
            , @RequestParam String ip) {
        model.addAttribute("nodeAlias", nodeAlias);
        model.addAttribute("nodeIpAddress", ip);
        model.addAttribute("pipelineName", pipelineName);
        //model.addAttribute("backupExistYn", nodeConfigService.backupExistYn(nodeAlias,ip,pipelineName));
        //model.addAttribute("drawJson", nodeConfigService.readJsonFile(nodeAlias, ip, pipelineName));
        //model.addAttribute("nodeList", nodeService.getNodeMenu());
        model.addAttribute("current", "/node/configurator/"+nodeAlias + "/"+pipelineName);
        return "view/configurator/pipeline";
    }
    
}
