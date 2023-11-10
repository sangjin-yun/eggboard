package com.sdplex.egg.utility;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

/**
 * @author leedk
 * 다국어 변환 도구
 */
@RequiredArgsConstructor
@Component
public class MessageUtils {

    private final MessageSource messageSource;

    public String getMsg(String code) {
        return this.getMsg(code, null);
    }

    public String getMsg(String code, String[] args) {
        return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
    }
}
