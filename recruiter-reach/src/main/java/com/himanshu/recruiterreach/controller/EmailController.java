package com.himanshu.recruiterreach.controller;

import com.himanshu.recruiterreach.dto.EmailRequest;
import com.himanshu.recruiterreach.dto.EmailResponse;
import com.himanshu.recruiterreach.dto.FollowUpRequest;
import com.himanshu.recruiterreach.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    // POST /api/email/send
    @PostMapping("/send")
    public ResponseEntity<EmailResponse> sendEmail(@RequestBody EmailRequest req) {
        try {
            String messageId = emailService.sendEmail(req);
            return ResponseEntity.ok(
                    new EmailResponse(true, "Email sent successfully!", messageId, null)
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new EmailResponse(false, "Failed: " + e.getMessage(), null, null));
        }
    }

    // POST /api/email/follow-up
    @PostMapping("/follow-up")
    public ResponseEntity<EmailResponse> sendFollowUp(@RequestBody FollowUpRequest req) {
        try {
            emailService.sendFollowUp(req);
            return ResponseEntity.ok(
                    new EmailResponse(true, "Follow-up sent!", null, null)
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new EmailResponse(false, "Failed: " + e.getMessage(), null, null));
        }
    }
}