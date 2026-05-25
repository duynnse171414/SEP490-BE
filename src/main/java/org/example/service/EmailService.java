package org.example.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async // ✅ đặt ở đây
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom("0923040196h@gmail.com");
            message.setTo(toEmail);
            message.setSubject("OTP Verification");
            message.setText("Your OTP is: " + otp + "\nThis code will expire in 5 minutes.");

            mailSender.send(message);

        } catch (Exception e) {
            // 🔥 rất quan trọng
            System.err.println("Send mail failed: " + e.getMessage());
        }
    }

    // EmailService.java
    public void sendResetPasswordOtp(String toEmail, String otp) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Reset Password OTP");
            helper.setText(
                    "<h2>Reset Password</h2>" +
                            "<p>Mã OTP để đặt lại mật khẩu của bạn là:</p>" +
                            "<h1 style='color:#e74c3c'>" + otp + "</h1>" +
                            "<p>Mã có hiệu lực trong <b>5 phút</b>.</p>" +
                            "<p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>",
                    true
            );
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send reset password email: " + e.getMessage());
        }
    }
}
