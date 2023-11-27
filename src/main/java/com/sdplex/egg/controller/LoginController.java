package com.sdplex.egg.controller;

import java.io.IOException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import com.sdplex.egg.domain.security.SecurityUser;

import lombok.extern.slf4j.Slf4j;

/**
 * @author goldbug
 *
 */
@Slf4j
@Controller
public class LoginController {

	@GetMapping("/")
	public String index(@AuthenticationPrincipal SecurityUser user) {
	    log.debug("USER : {}", user);
	    if (user != null) {
	        log.debug("USER : {}", user);
	        return "redirect:/dashboard";
	    } else {
	        return "redirect:/login";
	    }
	}

	@GetMapping("/login")
	public ModelAndView login(@AuthenticationPrincipal SecurityUser user) throws IOException {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("login");
        return mav;
    }

	@GetMapping("/forgot")
    public String forgot() {
        return "forgot";
    }

}
