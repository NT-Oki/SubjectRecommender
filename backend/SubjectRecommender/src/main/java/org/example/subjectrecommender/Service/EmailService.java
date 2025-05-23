//package org.example.subjectrecommender.Service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//public class EmailService {
//    @Autowired
//    private JavaMailSender mailSender;
//
//    public void sendResetPasswordEmail(String toEmail, String pass) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(toEmail);
//        message.setSubject("Yêu cầu đặt lại mật khẩu");
//        message.setText("Mật khẩu của bạn là " + pass);
//        mailSender.send(message);
//    }
//}
