package org.example.subjectrecommender.Controller;

import org.example.subjectrecommender.Model.ResetToken;
import org.example.subjectrecommender.Model.User;
import org.example.subjectrecommender.Service.EmailService;
import org.example.subjectrecommender.Service.ResetTokenService;
import org.example.subjectrecommender.Service.UserService;
import org.example.subjectrecommender.config.ValueProperties;
import org.example.subjectrecommender.dto.PasswordChangeDTO;
import org.example.subjectrecommender.dto.PasswordForgotDTO;
import org.example.subjectrecommender.dto.UserDTO;
import org.example.subjectrecommender.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    ResetTokenService resetTokenService;
    @Autowired
    EmailService emailService;
    @Autowired
    ValueProperties valueProperties;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String userID, @RequestParam String password) {
        if (userService.login(userID, password)) {
            User user=userService.getByID(userID);
            String token = jwtUtil.generateToken(userID,user.getRole());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "userId",userID,
                    "role",user.getRole()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mật khẩu chưa đúng");
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Không cần làm gì ở server nếu không lưu token
        return ResponseEntity.ok("Logout sucessful");
    }
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassWord(@RequestBody PasswordChangeDTO passwordChangeDTO) {
        if(userService.changePassWord(passwordChangeDTO.getUserId(), passwordChangeDTO.getNewPassWord())){
            return ResponseEntity.ok("Thay đổi mật khẩu thành công cho user "+passwordChangeDTO.getUserId());
        }else{
            return ResponseEntity.badRequest().body("Thay đổi mật khẩu thất bại cho user "+passwordChangeDTO.getUserId());
        }

    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody PasswordForgotDTO passwordForgotDTO) {
        System.out.println("forgoto");
        try {
            UserDTO userdto = userService.getUserDTO(passwordForgotDTO.getUserId());
//        if (userdto==null || !userdto.getEmail().equals(dto.getEmail())) {
            ResetToken resetToken = resetTokenService.create(passwordForgotDTO.getUserId());
            resetTokenService.save(resetToken);
            String content = resetToken.getToken();
            String subject = "Yêu cầu lấy lại mật khẩu";
            String body = "Mã xác thực để đặt lại mật khẩu của bạn là: ";
//        String email = userdto.getEmail();
            String email = valueProperties.getEmail();
            emailService.sendResetPasswordEmail(email,content,subject,body);
            return ResponseEntity.ok("Email đặt lại mật khẩu đã được gửi.");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Không tìm thấy sinh viên");
        }

    }
    @PostMapping("/check-token")
    public ResponseEntity<?> checkToken(@RequestBody PasswordForgotDTO passwordForgotDTO) {
        try {
            ResetToken resetToken = resetTokenService.findByToken(passwordForgotDTO.getToken());
            System.out.println(resetToken);
            if (!(resetToken.getUserId().equals(passwordForgotDTO.getUserId()))) {
                System.out.println(passwordForgotDTO.getUserId());
                return ResponseEntity.badRequest().body("Mã xác thực không chính xác.!");
            }
            if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
                resetTokenService.delete(resetToken.getId());
                return ResponseEntity.badRequest().body("Mã xác thực đã hết hạn!");
            }
            resetTokenService.delete(resetToken.getId());
            return ResponseEntity.ok("Mã xác thực chính xác");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Mã xác thực không chính xác!");
        }
    }



}
