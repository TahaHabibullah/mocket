package com.taha.backendservice.security;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Component
public class EncryptionUtils {

    @Value("${mocket.encryption.secret}")
    private String secret;
    @Value("${mocket.encryption.algorithm}")
    private String algorithm;

    public String encrypt(String data) {
        try {
            SecretKeySpec key = new SecretKeySpec(secret.getBytes(), algorithm);
            Cipher cipher = Cipher.getInstance(algorithm);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] encryptedData = cipher.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(encryptedData);
        } catch (Exception e) {
            return null;
        }
    }

    public String decrypt(String encryptedData) {
        try {
            SecretKeySpec key = new SecretKeySpec(secret.getBytes(), algorithm);
            Cipher cipher = Cipher.getInstance(algorithm);
            cipher.init(Cipher.DECRYPT_MODE, key);
            byte[] decodedData = Base64.getDecoder().decode(encryptedData);
            return new String(cipher.doFinal(decodedData));
        } catch (Exception e) {
            return null;
        }
    }
}
