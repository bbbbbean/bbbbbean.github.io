package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostListResponseDTO { // 새롭게 추가될 DTO
    private List<PostListDTO> posts; // 게시글 리스트
    private int totalPages;      // 총 페이지 수
    private long totalElements;  // (선택 사항) 총 게시글 개수
}
