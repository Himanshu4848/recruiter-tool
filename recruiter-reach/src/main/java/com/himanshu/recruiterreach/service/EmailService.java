package com.himanshu.recruiterreach.service;

import com.himanshu.recruiterreach.dto.EmailRequest;
import com.himanshu.recruiterreach.dto.FollowUpRequest;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.resume.path}")
    private String resumePath;

    @Value("${app.resume.filename}")
    private String resumeFilename;

    @Value("${spring.mail.username}")
    private String senderEmail;

    // ─── Send initial email ───────────────────────────────────────────
    public String[] sendEmail(EmailRequest req) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(senderEmail);
        helper.setTo(req.getRecruiterEmail());
        helper.setSubject(req.getSubject());
        helper.setText(req.getBody(), req.getHtmlBody());

        // Attach resume
        File resumeFile = new File(resumePath);
        if (resumeFile.exists()) {
            helper.addAttachment(resumeFilename, new FileSystemResource(resumeFile));
        }

        // ✅ Call saveChanges FIRST so JavaMail finalizes and generates Message-ID
        message.saveChanges();

        // ✅ Read the ACTUAL Message-ID that will be sent
        String messageId = message.getMessageID();

        // ✅ Now send — no more regeneration after this
        mailSender.send(message);

        // Return the real Message-ID
        return new String[]{messageId, req.getSubject()};
    }

    public void sendFollowUp(FollowUpRequest req) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(senderEmail);
        helper.setTo(req.getRecruiterEmail());

        // ✅ Subject must match original exactly (Gmail uses this too for threading)
        helper.setSubject("Re: " + req.getOriginalSubject());
        helper.setText(req.getBody(), false);

        // ✅ Set BEFORE saveChanges so they don't get wiped
        message.setHeader("In-Reply-To", req.getOriginalMessageId());
        message.setHeader("References", req.getOriginalMessageId());

        // ✅ saveChanges after setting headers
        message.saveChanges();

        mailSender.send(message);
    }
}