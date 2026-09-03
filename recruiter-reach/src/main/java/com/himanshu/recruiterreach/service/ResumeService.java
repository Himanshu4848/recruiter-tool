package com.himanshu.recruiterreach.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class ResumeService {

    @Value("${app.resume.path}")
    private String resumePath;

    @Value("${app.resume.filename}")
    private String resumeFilename;

    // ✅ on startup — copy resume from classpath if not already on disk
    @PostConstruct
    public void init() throws IOException {
        File resumeFile = new File(resumePath);
        if (!resumeFile.exists()) {
            resumeFile.getParentFile().mkdirs();
            ClassPathResource resource = new ClassPathResource("resume/Himanshu_Yadav_Latest_Resume.pdf");
            Files.copy(resource.getInputStream(), resumeFile.toPath());
        }
    }

    public void replaceResume(MultipartFile file) throws IOException {
        Path destination = Paths.get(resumePath);
        Files.createDirectories(destination.getParent());
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
    }

    public boolean resumeExists() {
        return new File(resumePath).exists();
    }

    public String getResumePath()    { return resumePath; }
    public String getResumeFilename() { return resumeFilename; }
}