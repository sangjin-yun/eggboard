package com.sdplex.egg.config.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.security.ConditionalOnDefaultWebSecurity;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdplex.egg.domain.User;
import com.sdplex.egg.domain.security.SecurityUser;
import com.sdplex.egg.dto.response.ResultResponse;
import com.sdplex.egg.exception.ErrorCode;
import com.sdplex.egg.exception.ErrorResponse;
import com.sdplex.egg.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * @author goldbug
 *
 */
@EnableWebSecurity
@RequiredArgsConstructor
@Configuration(proxyBeanMethods = false)
@ConditionalOnDefaultWebSecurity
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
public class SecurityConfig{

    private final ObjectMapper objectMapper;
    private final UserService userService;
    private final MessageSource messageSource;

    private static final String[] SWAGGER_WHITE_LIST = {
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };

    private static final String[] WEB_RESOURCE_LIST = {
            "/css/**",
            "/js/**",
            "/image/**",
            "/font/**",
            "/vendor/**"
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    /*
     * 로그아웃 후 재 로그인 시 로그인 불가 방지
     */
    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(this.userService);
        daoAuthenticationProvider.setPasswordEncoder(this.passwordEncoder());
        daoAuthenticationProvider.setHideUserNotFoundExceptions(false);
        return daoAuthenticationProvider;
    }

    @Bean
    @Order(SecurityProperties.BASIC_AUTH_ORDER)
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .antMatchers(SWAGGER_WHITE_LIST).permitAll()
            .antMatchers(WEB_RESOURCE_LIST).permitAll()
            .antMatchers("/", "/login", "/error", "/forgot", "/api/userManage/**", "/notification/**").permitAll()
            .antMatchers("/hello/user").hasAnyRole("USER", "ADMIN")
            .antMatchers("/hello/admin").hasRole("ADMIN")
            .anyRequest().authenticated()
        .and()
            .csrf()
        .and()
            .formLogin().loginPage("/login")
            .successHandler(new CustomLoginSuccessHandler(objectMapper, userService))
            .failureHandler(new CustomLoginFailureHandler(objectMapper))
            .usernameParameter("userId")
            .passwordParameter("password")
        .and()
            .logout()
            .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
            .logoutSuccessUrl("/login")
            .invalidateHttpSession(true)
            .deleteCookies("JSESSIONID", "remember-me-admin2").permitAll()
        .and()
            .sessionManagement()
            .maximumSessions(1)
            .maxSessionsPreventsLogin(false)
            .expiredUrl("/login?error=true&exception=1234")
            .sessionRegistry(this.sessionRegistry());

        http.rememberMe()
            .key("oncueAdmin2RememberMeKey")
            .rememberMeParameter("rememberMe")
            .rememberMeCookieName("remember-me-admin2")
            .tokenValiditySeconds(60 * 60 * 24) // 하루
            .alwaysRemember(true)
            .userDetailsService(userService);

        return http.build();
    }

    /**
     * 로그인 성공 시 처리
     * @author goldbug
     */
    @RequiredArgsConstructor
    static class CustomLoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
        private final ObjectMapper objectMapper;
        private final UserService userService;
        @Override
        public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
            User user = ((SecurityUser)authentication.getPrincipal()).getUser();
            userService.updateLastLogin(user.getUserId());

            String userId = request.getParameter("userId");
            String password = request.getParameter("password");
            Map<String, Object> map = new HashMap<>();
            if (userId.equals(password)) {
                map.put("PasswordChangeFlag", Boolean.TRUE);
            } else {
                map.put("PasswordChangeFlag", Boolean.FALSE);
            }

            String resultCode = "로그인 성공";
            ResultResponse<Map<String, Object>> result = ResultResponse.<Map<String, Object>>builder()
                    .httpStatus(HttpStatus.OK)
                    .resultCode(resultCode)
                    .resultMessage("로그인 성공")
                    .data(map)
                    .build();

            response.setContentType("application/json;charset=UTF-8");
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.setStatus(result.getHttpStatus().value());
            response.getWriter().print(objectMapper.writeValueAsString(result));
            response.getWriter().flush();
        }
    }

    /**
     * 로그인 실패 시 처리
     * @author goldbug
     */
    @RequiredArgsConstructor
    @Slf4j
    static class CustomLoginFailureHandler extends SimpleUrlAuthenticationFailureHandler {
        private final ObjectMapper objectMapper;
        @Override
        public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
            log.error("error : {}", exception);

            ErrorCode errorCode;
            if (exception instanceof UsernameNotFoundException) {
                // 사용자를 찾을 수 없을 경우
                errorCode = ErrorCode.USER_NOT_FOUND;
            } else if (exception instanceof BadCredentialsException) {
                // 비밀번호 틀렸을 경우(별도 처리 필요시 작성 - 현재는 사용자를 찾을 수 없습니다 - 처리)
                errorCode = ErrorCode.BAD_CREDENTIALS;
            } else if (exception instanceof SessionAuthenticationException) {
                // 이미 로그인 되어있을 경우
                errorCode = ErrorCode.MAXIMUM_SESSION_OF_ONE;
            } else {
                // 기타 오류
                errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
            }
            response.setContentType("application/json;charset=UTF-8");
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.setStatus(errorCode.getHttpStatus().value());
            response.getWriter().print(objectMapper.writeValueAsString(ErrorResponse.toResponseEntity(errorCode)));
            response.getWriter().flush();
        }
    }

}
