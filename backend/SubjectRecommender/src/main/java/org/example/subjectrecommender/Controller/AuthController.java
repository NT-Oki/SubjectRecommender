package org.example.subjectrecommender.Controller;

import org.example.subjectrecommender.Service.UserService;
import org.example.subjectrecommender.config.ValueProperties;
import org.example.subjectrecommender.dto.PasswordChangeDTO;
import org.example.subjectrecommender.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String userID, @RequestParam String password) {
        // Kiểm tra đăng nhập bằng service
        if (userService.login(userID, password)) {
            // Tạo token duy nhất với thời gian sống định nghĩa trong JwtUtil
            String token = jwtUtil.generateToken(userID);

            // Trả token về client
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "userId",userID
            ));
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
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassWord(@RequestBody PasswordChangeDTO passwordChangeDTO) {
        if(userService.changePassWord(passwordChangeDTO.getUserId(), passwordChangeDTO.getNewpassword())){
            return ResponseEntity.ok("Thay đổi mật khẩu thành công cho user "+passwordChangeDTO.getUserId());
        }else{
            return ResponseEntity.badRequest().body("Thay đổi mật khẩu thất bại cho user "+passwordChangeDTO.getUserId());
        }

    }
//    @PostMapping("/forgot-password")
//    public ResponseEntity<?> forgotPassword(@RequestBody PasswordForgotDTO dto) {
//        User userOpt = userService.getByID(dto.getUserId());
////        if (userOpt==null || !userOpt.getEmail().equals(dto.getEmail())) {
//        if (userOpt==null ) {
//            return ResponseEntity.badRequest().body("Không tìm thấy sinh viên");
//        }
//
//        String token = UUID.randomUUID().toString();
//        resetTokenRepository.save(new ResetToken(dto.getUserId(), token, LocalDateTime.now().plusMinutes(30)));
//
//        String resetLink = "http://localhost:3000/reset-password?token=" + token;
//        emailService.sendResetPasswordEmail(dto.getEmail(), resetLink);
//
//        return ResponseEntity.ok("Email đặt lại mật khẩu đã được gửi.");
//    }
//    @PostMapping("/reset-password")
//    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDTO dto) {
//        ResetToken tokenData = resetTokenRepository.findByToken(dto.getToken());
//        if (tokenData == null || tokenData.getExpiryTime().isBefore(LocalDateTime.now())) {
//            return ResponseEntity.badRequest().body("Token không hợp lệ hoặc đã hết hạn");
//        }
//
//        User user = userRepository.findById(tokenData.getUserId()).orElseThrow();
//        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
//        userRepository.save(user);
//
//        resetTokenRepository.delete(tokenData);
//
//        return ResponseEntity.ok("Đặt lại mật khẩu thành công!");
//    }


}
