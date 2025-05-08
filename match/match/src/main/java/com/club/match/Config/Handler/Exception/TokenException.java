package com.club.match.Config.Handler.Exception;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Slf4j
public class TokenException extends RuntimeException{

    public TokenException(String message, Throwable cause) {
        super(message,cause);
    }
}
