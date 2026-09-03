package com.himanshu.recruiterreach.service;

import com.himanshu.recruiterreach.dto.EmailRequest;
import com.himanshu.recruiterreach.dto.FollowUpRequest;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final ResumeService resumeService;

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${app.sender.email}")
    private String senderEmail;

    @Value("${app.resume.filename}")
    private String resumeFilename;

    public String sendEmail(EmailRequest req) throws Exception {
        Email from = new Email(senderEmail, "Himanshu Yadav");
        Email to   = new Email(req.getRecruiterEmail());

        Mail mail = new Mail();
        mail.setFrom(from);
        mail.setSubject(req.getSubject());

        // ✅ add recipient via Personalization
        Personalization personalization = new Personalization();
        personalization.addTo(to);
        mail.addPersonalization(personalization);

        // ✅ plain text MUST come first
        mail.addContent(new Content("text/plain", req.getBody()));
        // ✅ html comes second
        mail.addContent(new Content("text/html", req.getHtmlBody()));

        // attach resume
        attachResume(mail);

        String messageId = "<" + UUID.randomUUID() + "@recruiter-reach>";

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        Response response = sg.api(request);

        if (response.getStatusCode() >= 400) {
            throw new Exception("SendGrid error: " + response.getBody());
        }

        return messageId;
    }

    public void sendFollowUp(FollowUpRequest req) throws Exception {
        Email from    = new Email(senderEmail, "Himanshu Yadav");
        Email to      = new Email(req.getRecruiterEmail());
        Content content = new Content("text/plain", req.getBody());

        Mail mail = new Mail(from, "Re: " + req.getOriginalSubject(), to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        Response response = sg.api(request);

        if (response.getStatusCode() >= 400) {
            throw new Exception("SendGrid error: " + response.getBody());
        }
    }

    private void attachResume(Mail mail) throws IOException {
        String resumePath = resumeService.getResumePath();
        byte[] fileContent = Files.readAllBytes(Paths.get(resumePath));
        String encoded = Base64.getEncoder().encodeToString(fileContent);

        Attachments attachment = new Attachments();
        attachment.setContent(encoded);
        attachment.setType("application/pdf");
        attachment.setFilename(resumeFilename);
        attachment.setDisposition("attachment");

        mail.addAttachments(attachment);
    }
}