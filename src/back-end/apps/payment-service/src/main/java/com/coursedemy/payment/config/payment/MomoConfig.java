package com.coursedemy.payment.config.payment;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * MoMo Sandbox/Test configuration.
 * All values are loaded from environment variables.
 */
@Component
public class MomoConfig {

    public static String partnerCode;
    public static String accessKey;
    public static String secretKey;
    public static String endpoint;
    public static String redirectUrl;
    public static String ipnUrl;

    @Value("${momo.partner-code:MOMOBKUN20180529}")
    public void setPartnerCode(String partnerCode) {
        MomoConfig.partnerCode = (partnerCode != null && !partnerCode.isBlank()) ? partnerCode : "MOMOBKUN20180529";
    }

    @Value("${momo.access-key:klm05TvNBzhg7h7j}")
    public void setAccessKey(String accessKey) {
        MomoConfig.accessKey = (accessKey != null && !accessKey.isBlank()) ? accessKey : "klm05TvNBzhg7h7j";
    }

    @Value("${momo.secret-key:at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa}")
    public void setSecretKey(String secretKey) {
        MomoConfig.secretKey = (secretKey != null && !secretKey.isBlank()) ? secretKey : "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";
    }

    @Value("${momo.endpoint:https://test-payment.momo.vn/v2/gateway/api/create}")
    public void setEndpoint(String endpoint) {
        MomoConfig.endpoint = (endpoint != null && !endpoint.isBlank()) ? endpoint : "https://test-payment.momo.vn/v2/gateway/api/create";
    }

    @Value("${momo.redirect-url:http://localhost:8080/api/payment/momo/return}")
    public void setRedirectUrl(String redirectUrl) {
        MomoConfig.redirectUrl = (redirectUrl != null && !redirectUrl.isBlank()) ? redirectUrl : "http://localhost:8080/api/payment/momo/return";
    }

    @Value("${momo.ipn-url:http://localhost:8080/api/payment/momo/ipn}")
    public void setIpnUrl(String ipnUrl) {
        MomoConfig.ipnUrl = (ipnUrl != null && !ipnUrl.isBlank()) ? ipnUrl : "http://localhost:8080/api/payment/momo/ipn";
    }
}
