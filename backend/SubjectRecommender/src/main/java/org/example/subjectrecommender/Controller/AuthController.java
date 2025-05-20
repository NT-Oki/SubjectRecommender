package org.example.subjectrecommender.Controller;

import org.example.subjectrecommender.Service.UserService;
import org.example.subjectrecommender.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String userID, @RequestParam String password) {
        // Kiểm tra đăng nhập bằng service
        if (userService.login(userID, password)) {
            // Tạo token duy nhất với thời gian sống định nghĩa trong JwtUtil
            String token = jwtUtil.generateToken(userID);
            // Trả token về client
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } else {
            // Đăng nhập sai trả về lỗi 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mật khẩu chưa đúng");
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Không cần làm gì ở server nếu không lưu token
        return ResponseEntity.ok("Logged out");
    }
}
