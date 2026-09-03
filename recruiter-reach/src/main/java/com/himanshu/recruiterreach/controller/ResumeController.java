package com.himanshu.recruiterreach.controller;

import com.himanshu.recruiterreach.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @Value("${app.resume.filename}")
    private String resumeFilename;

    // GET /api/resume/download  — download the current resume
    @GetMapping("/download")
    public ResponseEntity<FileSystemResource> downloadResume() {
        if (!resumeService.resumeExists()) {
            return ResponseEntity.notFound().build();
        }
        FileSystemResource resource = new FileSystemResource(resumeService.getResumePath());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resumeFilename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    // POST /api/resume/upload  — replace stored resume
    @PostMapping("/upload")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty() || !file.getOriginalFilename().endsWith(".pdf")) {
            return ResponseEntity.badRequest().body("Please upload a valid PDF file.");
        }
        try {
            resumeService.replaceResume(file);
            return ResponseEntity.ok("Resume replaced successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Upload failed: " + e.getMessage());
        }
    }

    // GET /api/resume/status  — check if resume exists
    @GetMapping("/status")
    public ResponseEntity<String> resumeStatus() {
        return ResponseEntity.ok(resumeService.resumeExists() ? "Resume found" : "No resume uploaded");
    }
}