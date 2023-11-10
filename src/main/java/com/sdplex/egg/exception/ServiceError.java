package com.sdplex.egg.exception;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.sdplex.egg.dto.response.ResultResponse;

/**
 * @author goldbug
 * 예외코드 메시지
 */
public enum ServiceError {

	NOT_FOUND("message.exception.notFound") {
		@Override
		public <T> ResultResponse<T> getResultResponse(Object[] args) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.NOT_FOUND)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(args))
					.build();
		}

		@Override
		public <T> ResultResponse<T> getResultResponse(Object[] args, T data) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.NOT_FOUND)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(args))
					.data(data)
					.build();
		}

		@Override
		public <T> ResultResponse<T> getResultResponse(T data) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.NOT_FOUND)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(null))
					.data(data)
					.build();
		}

	},
	BAD_REQUEST("message.exception.badRequest") {
		@Override
		public <T> ResultResponse<T> getResultResponse(Object[] args) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.BAD_REQUEST)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(args))
					.build();
		}

		@Override
		public <T> ResultResponse<T> getResultResponse(Object[] args, T data) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.BAD_REQUEST)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(args))
					.data(data)
					.build();
		}

		@Override
		public <T> ResultResponse<T> getResultResponse(T data) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.BAD_REQUEST)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(null))
					.data(data)
					.build();
		}
	},
	CONNECT_TIME_OUT("message.exception.connectTimeout") {
		@Override
		public <T> ResultResponse<T> getResultResponse(Object[] args) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.REQUEST_TIMEOUT)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(args))
					.build();
		}

		@Override
		public <T> ResultResponse<T> getResultResponse(Object[] args, T data) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.REQUEST_TIMEOUT)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(args))
					.data(data)
					.build();
		}

		@Override
		public <T> ResultResponse<T> getResultResponse(T data) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.REQUEST_TIMEOUT)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(null))
					.data(data)
					.build();
		}
	},
	ACCESS_DENIED("message.exception.accessDenied") {
		@Override
		public <T> ResultResponse<T> getResultResponse(Object[] args) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.FORBIDDEN)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(args))
					.build();
		}

		@Override
		public <T> ResultResponse<T> getResultResponse(Object[] args, T data) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.FORBIDDEN)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(args))
					.data(data)
					.build();
		}

		@Override
		public <T> ResultResponse<T> getResultResponse(T data) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.FORBIDDEN)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(null))
					.data(data)
					.build();
		}
	},
	COMMON_EXCEPTION("message.exception.commonError") {
		@Override
		public <T> ResultResponse<T> getResultResponse(Object[] args) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.INTERNAL_SERVER_ERROR)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(args))
					.build();
		}

		@Override
		public <T> ResultResponse<T> getResultResponse(Object[] args, T data) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.INTERNAL_SERVER_ERROR)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(args))
					.data(data)
					.build();
		}

		@Override
		public <T> ResultResponse<T> getResultResponse(T data) {
			return ResultResponse.<T>builder()
					.httpStatus(HttpStatus.INTERNAL_SERVER_ERROR)
					.resultCode(getErrorCode())
					.resultMessage(getMessage(null))
					.data(data)
					.build();
		}
	};

	ServiceError(String errorCode) {
		this.errorCode = errorCode;
	}

	private String errorCode;
	private MessageSource messageSource;

	public abstract <T> ResultResponse<T> getResultResponse(Object[] args);
	public abstract <T> ResultResponse<T> getResultResponse(Object[] args, T data);
	public abstract <T> ResultResponse<T> getResultResponse(T data);

	public String getMessage(Object[] args) {
		Locale locale = LocaleContextHolder.getLocale();
		return messageSource.getMessage(errorCode, args, locale);
	}

	public String getErrorCode() {
		return errorCode;
	}

	private void setMessageSource(MessageSource messageSource) {
		this.messageSource = messageSource;
	}

	/**
	 * 해시맵 사이즈 exception 사이즈 만큼 변경 필수
	 */
	private static final Map<String, ServiceError> enums = new HashMap<>(4);

	public static ServiceError find(String errorCode) {
		return enums.get(errorCode);
	}

	// messageSource inject, enum indexing 용 클래스
	@Component
	private static class EnumExecptionInjector {
		@Autowired
		private MessageSource messageSource;

		@PostConstruct
		private void init() {
			for (ServiceError se : ServiceError.values()/*EnumSet.allOf(ServiceError.class)*/) {
				se.setMessageSource(messageSource);
				enums.put(se.getErrorCode(), se);
			}
		}
	}

}