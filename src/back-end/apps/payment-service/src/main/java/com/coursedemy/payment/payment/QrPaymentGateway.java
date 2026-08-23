package com.coursedemy.payment.payment;

import com.coursedemy.payment.dto.PaymentRequest;
import com.coursedemy.payment.dto.PaymentResponse;
import com.coursedemy.payment.entity.PaymentTransaction;
import com.coursedemy.payment.enums.PaymentMethod;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.Map;

/**
 * QR Payment Gateway - MOCK/TEST ONLY
 * Generates a QR code for demo purposes.
 * This is NOT a real payment gateway integration.
 */
@Component
public class QrPaymentGateway implements PaymentGateway {

    private static final String QR_PREFIX = "COURSEDEMY";
    private static final String QR_SEPARATOR = "|";

    @Override
    public PaymentMethod getPaymentMethod() {
        return PaymentMethod.QR;
    }

    @Override
    public PaymentResponse createPayment(PaymentRequest request, PaymentTransaction transaction) throws Exception {
        String qrContent = buildQrContent(transaction, request.getAmount());
        String qrCodeBase64 = generateQrCode(qrContent);

        return PaymentResponse.pending(
                PaymentMethod.QR,
                request.getAmount(),
                transaction.getTransactionNo(),
                null,
                qrCodeBase64,
                "QR payment created successfully"
        );
    }

    @Override
    public PaymentResponse processCallback(Map<String, String> params) throws Exception {
        // QR mock does not have real callbacks.
        // This method is not used for QR in production.
        throw new UnsupportedOperationException("QR payment does not support real callbacks. Use mock-success endpoint for testing.");
    }

    /**
     * Build QR content: COURSEDEMY|TXN{transactionNo}|{amount}|PENDING
     */
    private String buildQrContent(PaymentTransaction transaction, Double amount) {
        return String.format("%s%s%s%s%.0f%sPENDING",
                QR_PREFIX,
                QR_SEPARATOR,
                transaction.getTransactionNo(),
                QR_SEPARATOR,
                amount,
                QR_SEPARATOR);
    }

    /**
     * Generate QR code as base64 PNG data URI.
     */
    private String generateQrCode(String content) throws Exception {
        QRCodeWriter qrWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrWriter.encode(content, BarcodeFormat.QR_CODE, 250, 250);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);

        byte[] pngData = pngOutputStream.toByteArray();
        String base64 = Base64.getEncoder().encodeToString(pngData);

        return "data:image/png;base64," + base64;
    }
}
