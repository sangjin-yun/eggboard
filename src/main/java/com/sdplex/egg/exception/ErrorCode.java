package com.sdplex.egg.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * @author goldbug
 *
 */
@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    /* 400 BAD_REQUEST : 잘못된 요청 */
    INVALID_PARAMETER(HttpStatus.BAD_REQUEST, "파라미터가 유효하지 않습니다."),

    /* 400 BAD_REQUEST : 잘못된 요청 */
    PIPE_INSERT_WITHOUT_POD(HttpStatus.BAD_REQUEST, "등록된 POD정보 없이 PIPE를 등록하려 합니다."),

    /* 401 UNAUTHORIZED : 인증되지 않은 사용자 */
    UNAUTHORIZED_USER(HttpStatus.UNAUTHORIZED, "인증되지 않은 사용자입니다."),

    /* 403 FORBIDDEN : 이미 로그인되어 있음 */
    MAXIMUM_SESSION_OF_ONE(HttpStatus.FORBIDDEN, "이미 로그인되어 있습니다."),

    /* 404 NOT_FOUND : Resource를 찾을 수 없음 */
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자 정보를 찾을 수 없습니다."),

    BAD_CREDENTIALS(HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다."),

    /* 409 CONFLICT : Resource의 현재 상태와 충돌, 중복된 데이터 문제 */
    DUPLICATE_RESOURCE(HttpStatus.CONFLICT, "데이터가 이미 존재합니다."),

    /* 500 INTERNAL_SERVER_ERROR : 서버 오류 */
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버에 오류가 발생했습니다."),

    ;

    private final HttpStatus httpStatus;
    private final String message;

}
