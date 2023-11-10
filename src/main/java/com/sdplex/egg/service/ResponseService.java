package com.sdplex.egg.service;

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sdplex.egg.dto.response.ResultResponse;
import com.sdplex.egg.exception.ServiceError;

import lombok.RequiredArgsConstructor;

/**
 * @author goldbug
 * ResponseEntity를 생성하여 리턴하는 서비스
 */
@RequiredArgsConstructor
@Service
public class ResponseService<T> {

	private final MessageSource messageSource;
	private Locale locale = LocaleContextHolder.getLocale();

	public ResponseEntity<ResultResponse<T>> setDefault() {
		ResultResponse<T> result = ResultResponse.<T>builder().build();
		String resultCode = "message.common.success";
		result.setHttpStatus(HttpStatus.OK);
		result.setResultCode(resultCode);
		result.setResultMessage(messageSource.getMessage(resultCode, null, locale));
		return ResponseEntity.ok().body(result);
	}

	public ResponseEntity<ResultResponse<T>> setData(T data) {
		ResultResponse<T> result = ResultResponse.<T>builder().data(data).build();
		String resultCode = "message.common.success";
		result.setHttpStatus(HttpStatus.OK);
		result.setResultCode(resultCode);
		result.setResultMessage(messageSource.getMessage(resultCode, null, locale));
		return ResponseEntity.ok().body(result);
	}

	public ResponseEntity<ResultResponse<T>> setDataWithMessage(T data, String resultCode) {
		ResultResponse<T> result = ResultResponse.<T>builder().data(data).build();
		result.setHttpStatus(HttpStatus.OK);
		result.setResultCode(resultCode);
		result.setResultMessage(messageSource.getMessage(resultCode, null, locale));
		return ResponseEntity.ok().body(result);
	}

	public ResponseEntity<ResultResponse<T>> setDataWithMessage(T data, String resultCode, String[] args) {
		ResultResponse<T> result = ResultResponse.<T>builder().data(data).build();
		result.setHttpStatus(HttpStatus.OK);
		result.setResultCode(resultCode);
		result.setResultMessage(messageSource.getMessage(resultCode, args, locale));
		return ResponseEntity.ok().body(result);
	}

	public ResponseEntity<ResultResponse<T>> setMessage(String resultCode) {
		ResultResponse<T> result = ResultResponse.<T>builder().build();
		result.setHttpStatus(HttpStatus.OK);
		result.setResultCode(resultCode);
		result.setResultMessage(messageSource.getMessage(resultCode, null, locale));
		return ResponseEntity.ok().body(result);
	}

	public ResponseEntity<ResultResponse<T>> setMessage(String resultCode, String[] args) {
		ResultResponse<T> result = ResultResponse.<T>builder().build();
		result.setHttpStatus(HttpStatus.OK);
		result.setResultCode(resultCode);
		result.setResultMessage(messageSource.getMessage(resultCode, args, locale));
		return ResponseEntity.ok().body(result);
	}

	public ResponseEntity<ResultResponse<T>> setError(String errorCode) {
		ServiceError se = ServiceError.find(errorCode);
		ResultResponse<T> result = se.getResultResponse(null);
		return ResponseEntity.status(result.getHttpStatus()).body(result);
	}

	public ResponseEntity<ResultResponse<T>> setError(String errorCode, String[] args) {
		ServiceError se = ServiceError.find(errorCode);
		ResultResponse<T> result = se.getResultResponse(args);
		return ResponseEntity.status(result.getHttpStatus()).body(result);
	}

	public ResponseEntity<ResultResponse<T>> setErrorWithData(T data, String errorCode) {
		ServiceError se = ServiceError.find(errorCode);
		ResultResponse<T> result = se.getResultResponse(null);
		result.setData(data);
		return ResponseEntity.status(result.getHttpStatus()).body(result);
	}

	public ResponseEntity<ResultResponse<T>> setErrorWithData(T data, String errorCode, String[] args) {
		ServiceError se = ServiceError.find(errorCode);
		ResultResponse<T> result = se.getResultResponse(args);
		result.setData(data);
		return ResponseEntity.status(result.getHttpStatus()).body(result);
	}

}
