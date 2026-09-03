package com.himanshu.recruiterreach.dto;

import lombok.Data;

@Data
public class FollowUpRequest {
    private String recruiterName;
    private String companyName;
    private String recruiterEmail;
    private String originalSubject;
    private String originalMessageId;   // stored from first email to thread replies
    private String body;
}