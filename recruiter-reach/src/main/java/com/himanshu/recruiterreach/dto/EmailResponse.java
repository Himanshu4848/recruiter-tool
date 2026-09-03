package com.himanshu.recruiterreach.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmailResponse {
    private boolean success;
    private String message;
    private String messageId;
    private String actualSubject;  // ← make sure this exists
}