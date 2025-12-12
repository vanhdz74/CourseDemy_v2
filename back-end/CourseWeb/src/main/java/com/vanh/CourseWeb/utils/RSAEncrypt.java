package com.vanh.CourseWeb.utils;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.security.*;
import javax.crypto.Cipher;
import java.util.Base64;

@Component
public final class RSAEncrypt {

    private static final String RSA_ALGORITHM = "RSA";
    private static final String RSA_CIPHER = "RSA/ECB/PKCS1Padding";
    private KeyPair keyPair;

    @PostConstruct
    public void init() throws Exception {
        keyPair = generateKeyPair(2048);
        System.out.println("Public key: " + publicKeyToBase64(keyPair.getPublic()));
        System.out.println("Private key: " + privateKeyToBase64(keyPair.getPrivate()));
    }

    // Tạo cặp khóa (khóa công khai và khóa bí mật)
    public KeyPair generateKeyPair(int keySize) throws NoSuchAlgorithmException {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance(RSA_ALGORITHM);
        kpg.initialize(keySize);
        return kpg.generateKeyPair();
    }

    //Mã hóa mảng byte bằng khóa công khai
    public byte[] encrypt(byte[] plain, PublicKey pub) throws Exception {
        Cipher cipher = Cipher.getInstance(RSA_CIPHER);
        cipher.init(Cipher.ENCRYPT_MODE, pub);
        return cipher.doFinal(plain);
    }


    //Giải mã mảng byte bằng khóa bí mật

    public byte[] decrypt(byte[] cipherText, PrivateKey priv) throws Exception {
        Cipher cipher = Cipher.getInstance(RSA_CIPHER);
        cipher.init(Cipher.DECRYPT_MODE, priv);
        return cipher.doFinal(cipherText);
    }


    //Mã hóa chuỗi utf8 và trả về bản mã dạng base64

    public String encryptStringToBase64(String plain, PublicKey pub) throws Exception {
        byte[] encrypted = encrypt(plain.getBytes("UTF-8"), pub);
        return Base64.getEncoder().encodeToString(encrypted);
    }


    //Giải mã bản mã Base64 thành chuỗi utf8

    public String decryptBase64ToString(String base64Cipher, PrivateKey priv) throws Exception {
        byte[] cipherBytes = Base64.getDecoder().decode(base64Cipher);
        byte[] plainBytes = decrypt(cipherBytes, priv);
        return new String(plainBytes, "UTF-8");
    }


    //Chuyển khóa công khai và khóa bí mật sang chuỗi Base64
    //Dùng để in hoặc lưu trữ.

    public String publicKeyToBase64(PublicKey pub) {
        return Base64.getEncoder().encodeToString(pub.getEncoded());
    }

    public String privateKeyToBase64(PrivateKey priv) {
        return Base64.getEncoder().encodeToString(priv.getEncoded());
    }

    public PublicKey getPublicKey() {
        return keyPair.getPublic();
    }

    public PrivateKey getPrivateKey() {
        return keyPair.getPrivate();
    }

}