package com.club.match.Controller;

import com.club.match.Domain.Service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@Slf4j
public class ProFileController {

    private static final List<String> IMAGE_EXTENSION = Arrays.asList("jpg", "jpeg", "png", "gif", "webp");

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> profile(@PathVariable String userId) throws IOException {

        Path userDir = Paths.get("src/main/resources/Users/" + userId + "/profile");

        if (!Files.exists(userDir) || !Files.isDirectory(userDir)) {
            return ResponseEntity.notFound().build();
        }

        Path userImagePath = null;
        for (String item : IMAGE_EXTENSION) {
            Path ckechPath = userDir.resolve("profile." + item);
            if (Files.exists(ckechPath)) {
                userImagePath = ckechPath;
                break;
            }
        }

        Resource imageResource = new UrlResource(userImagePath.toUri());
        String contentType = Files.probeContentType(userImagePath);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + userImagePath.getFileName() + "\"")
                .body(imageResource);

    }
}
