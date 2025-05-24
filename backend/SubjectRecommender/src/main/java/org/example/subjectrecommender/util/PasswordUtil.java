package org.example.subjectrecommender.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordUtil {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public static String hashPassword(String plainPassword) {
        return encoder.encode(plainPassword);
    }

    public static boolean matchPassword(String plainPassword, String hashedPassword) {
        return encoder.matches(plainPassword, hashedPassword);
    }

    public static void main(String[] args) {
        System.out.println(hashPassword("thao21130542"));
        System.out.println(matchPassword("dat","$2a$10$h.7jvGMyJ4s9l8rUlk3R9uupZv9U0q3spz26cwlO.OM6IjnbKKAqm"));
    }
}
