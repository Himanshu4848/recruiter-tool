package com.himanshu.recruiterreach.service;

import com.himanshu.recruiterreach.dto.EmailRequest;
import com.himanshu.recruiterreach.dto.FollowUpRequest;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final ResumeService resumeService;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${app.resume.filename}")
    private String resumeFilename;

    public String sendEmail(EmailRequest req) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(senderEmail);
        helper.setTo(req.getRecruiterEmail());
        helper.setSubject(req.getSubject());
        helper.setText(req.getBody(), req.getHtmlBody());

        // ✅ use getResumePath() directly
        helper.addAttachment(resumeFilename,
                new org.springframework.core.io.FileSystemResource(resumeService.getResumePath()));

        message.removeHeader("In-Reply-To");
        message.removeHeader("References");

        message.saveChanges();
        String messageId = message.getMessageID();
        mailSender.send(message);

        return messageId;
    }

    public void sendFollowUp(FollowUpRequest req) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(senderEmail);
        helper.setTo(req.getRecruiterEmail());
        helper.setSubject("Re: " + req.getOriginalSubject());
        helper.setText(req.getBody(), false);

        message.saveChanges();
        mailSender.send(message);
    }
}