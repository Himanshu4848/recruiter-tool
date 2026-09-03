package com.himanshu.recruiterreach.dto;

import lombok.Data;

@Data
public class EmailRequest {
    private String recruiterName;
    private String companyName;
    private String recruiterEmail;
    private String subject;
    private String body;
    private String htmlBody; // editable email body from frontend
}