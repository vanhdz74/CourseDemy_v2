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

    @Value("${momo.partner-code:}")
    public void setPartnerCode(String partnerCode) {
        MomoConfig.partnerCode = partnerCode;
    }

    @Value("${momo.access-key:}")
    public void setAccessKey(String accessKey) {
        MomoConfig.accessKey = accessKey;
    }

    @Value("${momo.secret-key:}")
    public void setSecretKey(String secretKey) {
        MomoConfig.secretKey = secretKey;
    }

    @Value("${momo.endpoint:https://test-payment.momo.vn/v2/gateway/api/create}")
    public void setEndpoint(String endpoint) {
        MomoConfig.endpoint = endpoint;
    }

    @Value("${momo.redirect-url:http://localhost:8086/api/payment/momo/return}")
    public void setRedirectUrl(String redirectUrl) {
        MomoConfig.redirectUrl = redirectUrl;
    }

    @Value("${momo.ipn-url:http://localhost:8086/api/payment/momo/ipn}")
    public void setIpnUrl(String ipnUrl) {
        MomoConfig.ipnUrl = ipnUrl;
    }
}
