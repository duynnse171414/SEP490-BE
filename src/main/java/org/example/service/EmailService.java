package org.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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
}
