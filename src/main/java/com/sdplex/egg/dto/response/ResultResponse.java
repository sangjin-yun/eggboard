package com.sdplex.egg.dto.response;

import java.io.Serializable;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author leedk
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ResultResponse<T> implements Serializable {

    private static final long serialVersionUID = 2685898254586874208L;

    private HttpStatus httpStatus;

    private String resultCode;

    private String resultMessage;

    private T data;

}